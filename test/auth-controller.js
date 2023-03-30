const { expect } = require("chai");
const mongoose = require("mongoose");
const sinon = require("sinon");

const User = require("../models/user");
const AuthController = require("../controllers/auth");

const MONGODB_URI =
  "mongodb+srv://azeemaleem:Jn0ZB1F4OtgYhxPb@cluster0.0tnogk2.mongodb.net/messages?retryWrites=true&w=majority";

describe("Auth Controller- Login", function () {
  it("Should throw an error if data base fails", function (done) {
    sinon.stub(User, "findOne");
    User.findOne.throws();

    const req = {
      body: {
        email: "azeemaleem733@gmail.com",
        password: "123456",
      },
    };
    AuthController.login(req, {}, () => {}).then((result) => {
      console.log(result);
      expect(result).to.be.an("error");
      expect(result).to.have.property("statusCode", 500);
      done();
    });
    User.findOne.restore();
  });
  it("should responed with valid user status of an existing user", function (done) {
    mongoose
      .connect(MONGODB_URI)
      .then((res) => {
        const user = new User({
          email: "azeem@gmail.com",
          password: "123456",
          name: "azeem",
          post: [],
        });
        user.save();
      })
      .then((userStatus) => {})
      .catch((err) => console.log(err));
  });
});
