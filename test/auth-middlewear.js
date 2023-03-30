const { expect } = require("chai");
const authMiddlewear = require("../middlewear/auth-middlewear");

describe("Auth Middlewear", function () {
  it("should throw an error if no header authorization found", function () {
    const req = {
      get: function (headerName) {
        return null;
      },
    };

    expect(authMiddlewear.bind(this, req, {}, () => {})).to.throw(
      "No Authenticated"
    );
  });

  it("should throw an error if no header have only one string", function () {
    const req = {
      get: function (headerName) {
        return "anyToken";
      },
    };

    expect(authMiddlewear.bind(this, req, {}, () => {})).to.throw();
  });
});
