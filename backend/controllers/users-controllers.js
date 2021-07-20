const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const signup = async (req, res, next) => {
  if (!validationResult(req).isEmpty()) {
    return next(new HttpError("Invalid arguments.", 422));
  }

  const { userName, email, password } = req.body;

  let userToSignup;
  try {
    userToSignup = await User.findOne({ email: email }, "email password");
    userNameController = await User.findOne({ userName: userName }, "userName");
  } catch (err) {
    return next(
      new HttpError("The request failed while controlling the user.", 500)
    );
  }

  if (userToSignup) {
    return next(
      new HttpError(
        "The registered user with this credentials (email) already exists.",
        422
      )
    );
  }

  if (userNameController) {
    return next(
      new HttpError(
        "The registered user with this credentials (username) already exists.",
        422
      )
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(
      new HttpError(
        "The request failed while signing up (hashing password).",
        500
      )
    );
  }

  userToSignup = new User({
    userName,
    email,
    password: hashedPassword,
    ratings: [],
    topN: [],
  });

  try {
    await userToSignup.save();
  } catch (err) {
    return next(new HttpError("The request failed while signing up.", 500));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: userToSignup.id, email: userToSignup.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    return next(
      new HttpError("The request failed while signing up (tokening).", 500)
    );
  }

  res
    .status(201)
    .json({ user: userToSignup.toObject({ getters: true }), token: token });
};

const login = async (req, res, next) => {
  if (!validationResult(req).isEmpty()) {
    return next(new HttpError("Invalid arguments.", 422));
  }

  const { email, password } = req.body;

  let userToLogin;
  try {
    userToLogin = await User.findOne({ email: email }, "email password");
  } catch (err) {
    return next(new HttpError("The request failed while logging in.", 500));
  }

  if (!userToLogin) {
    return next(new HttpError("Could not authenticate.", 401));
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, userToLogin.password);
  } catch (err) {
    return next(
      new HttpError(
        "The request failed while signing up (hashing password).",
        500
      )
    );
  }

  if (!isValidPassword) {
    return next(
      new HttpError("Could not authenticate (invalid credentials).", 401)
    );
  }

  let token;
  try {
    token = jwt.sign(
      { userId: userToLogin.id, email: userToLogin.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    return next(
      new HttpError("The request failed while signing up (tokening).", 500)
    );
  }

  res
    .status(200)
    .json({ user: userToLogin.toObject({ getters: true }), token: token });
};

const getCurrentUser = async (req, res, next) => {
  const { userId } = req.params;

  let userToGet;
  try {
    userToGet = await User.findById(
      userId,
      "email userName ratings topN"
    ).populate("ratings");
  } catch (err) {
    return next(
      new HttpError("The request failed while getting the user data.", 500)
    );
  }
  if (!userToGet) {
    return next(new HttpError("Could not find the user.", 404));
  }

  res.status(200).json({ user: userToGet.toObject({ getters: true }) });
};

const getAllUsers = async (req, res, next) => {
  let usersToGet;
  try {
    usersToGet = await User.find({}, "email userName");
  } catch (err) {
    return next(
      new HttpError("The request failed while getting the users.", 500)
    );
  }
  res.json({
    users: usersToGet.map((user) => user.toObject({ getters: true })),
  });
};

const updateTopN = async (req, res, next) => {
  const { userId } = req.params;
  const { movies } = req.body;

  let userToGet;
  try {
    userToGet = await User.findById(userId, "topN");
  } catch (err) {
    return next(
      new HttpError("The request failed while getting the user data.", 500)
    );
  }
  if (!userToGet) {
    return next(new HttpError("Could not find the user.", 404));
  }

  userToGet.topN = movies;

  try {
    await userToGet.save();
  } catch (err) {
    return next(
      new HttpError("The request failed while updating the topN.", 500)
    );
  }

  res.status(201).json({ user: userToGet.toObject({ getters: true }) });
};

exports.signup = signup;
exports.login = login;
exports.getCurrentUser = getCurrentUser;
exports.updateTopN = updateTopN;
