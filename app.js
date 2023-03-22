const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const { graphqlHTTP } = require("express-graphql");
const auth = require("./middlewear/auth-middlewear");
const fs = require("fs");
const { clearImage } = require("./utils/file");

const graphqlSchema = require("./graphql/schema");
const graphqlResolvers = require("./graphql/resolvers");

// const feedRoutes = require("./routes/feed");
// const authRoutes = require("./routes/auth");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const MONGODB_URI =
  "mongodb+srv://azeemaleem:Jn0ZB1F4OtgYhxPb@cluster0.0tnogk2.mongodb.net/messages?retryWrites=true&w=majority";

app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
// app.use("/feed", feedRoutes);
// app.use("/auth", authRoutes);
app.use(auth);

app.put("/post-image", (req, res, next) => {
  console.log(req.body, "post image body");
  if (!req.isAuth) {
    throw new Error("Not Authenticated");
  }
  if (!req.file) {
    return res.status(200).json({ message: "No file found" });
  }
  if (req.body.oldPath) {
    clearImage(req.body.oldPath);
  }
  return res
    .status(201)
    .json({ message: "File stored successfully", filePath: req.file.path });
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
    formatError(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || "An error occurred.";
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    },
  })
);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(MONGODB_URI)
  .then((res) => {
    app.listen(8080);
    console.log("app is listening at 8080");
  })
  .catch((err) => console.log(err));
