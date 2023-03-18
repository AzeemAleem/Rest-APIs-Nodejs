const express = require("express");
const feedRoutes = require("../controllers/feed");
const router = express.Router();
const { body } = require("express-validator/check");
const isAuth = require("../middlewear/auth-middlewear");

router.get("/posts", feedRoutes.getPosts);
router.post(
  "/post",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedRoutes.createPost
);
router.get("/post/:postId", isAuth, feedRoutes.getPost);

router.put(
  "/post/:postId",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedRoutes.updatePost
);

router.delete("/post/:postId", isAuth, feedRoutes.deletePost);
module.exports = router;
