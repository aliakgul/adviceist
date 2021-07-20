const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; //Authorization: 'Bearer TOKEN'
    if (!token) {
      //scenario: token is not a token
      throw new Error("Auth Failed!");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = {
      userId: decodedToken.userId,
    };
    next();
  } catch (err) {
    //scenario: split failed
    return next(
      new HttpError("Could not authenticate (middleware token).", 401)
    );
  }
};
