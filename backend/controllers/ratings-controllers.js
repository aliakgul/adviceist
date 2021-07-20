const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const User = require("../models/user");
const Rating = require("../models/rating");

const getAllRatings = async (req, res, next) => {
  const { userId } = req.params;

  let userWithRatings;
  try {
    userWithRatings = await User.findById(userId, "ratings").populate(
      "ratings"
    );
  } catch (err) {
    return next(
      new HttpError("The request failed while getting the user.", 500)
    );
  }
  if (!userWithRatings || userWithRatings.ratings.length === 0) {
    return next(new HttpError("Could not find the user or user ratings.", 404));
  }

  res.status(200).json({
    ratings: userWithRatings.ratings.map((rating) =>
      rating.toObject({ getters: true })
    ),
  });
};

const getRating = async (req, res, next) => {
  const { userId, movieId } = req.params;

  let ratingToGet;
  try {
    ratingToGet = await Rating.findOne({ userId: userId, movieId: movieId });
  } catch (err) {
    return next(
      new HttpError("The request failed while getting the rating.", 500)
    );
  }
  if (!ratingToGet) {
    return next(new HttpError("Could not find the rating.", 404));
  }

  res.status(200).json({ rating: ratingToGet.toObject({ getters: true }) });
};

const createRating = async (req, res, next) => {
  if (!validationResult(req).isEmpty()) {
    return next(new HttpError("Invalid arguments.", 422));
  }

  const { userId, movieId } = req.params;
  const { rating } = req.body;

  let userWithRatings;
  try {
    userWithRatings = await User.findById(userId, "ratings").populate(
      "ratings"
    );
  } catch (err) {
    return next(
      new HttpError("The request failed while getting the user.", 500)
    );
  }
  if (!userWithRatings) {
    return next(
      new HttpError("Could not find the user with provided id.", 404)
    );
  }

  const ratingToCreate = new Rating({
    userId,
    movieId,
    rating,
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await ratingToCreate.save({ session: sess });
    userWithRatings.ratings.push(ratingToCreate);
    await userWithRatings.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(
      new HttpError("The request failed while creating the rating.", 500)
    );
  }
  res.status(201).json({ rating: ratingToCreate.toObject({ getters: true }) });
};

const updateRating = async (req, res, next) => {
  if (!validationResult(req).isEmpty()) {
    return next(new HttpError("Invalid arguments.", 422));
  }

  const { userId, movieId } = req.params;
  const { rating } = req.body;

  let ratingToUpdate;
  try {
    ratingToUpdate = await Rating.findOne({ userId: userId, movieId: movieId });
  } catch (err) {
    return next(
      new HttpError("The request failed while getting the rating.", 500)
    );
  }
  if (!ratingToUpdate) {
    return next(
      new HttpError(
        "Could not find the rating with provided user and movie.",
        404
      )
    );
  }

  if (ratingToUpdate.userId.toString() !== req.userData.userId) {
    return next(new HttpError("You are not allowed to edit this rating.", 401));
  }

  ratingToUpdate.rating = rating;

  try {
    await ratingToUpdate.save();
  } catch (err) {
    return next(
      new HttpError("The request failed while updating the rating.", 500)
    );
  }
  res.status(201).json({ rating: ratingToUpdate.toObject({ getters: true }) });
};

const deleteRating = async (req, res, next) => {
  const { userId, movieId } = req.params;

  let ratingToDelete;
  try {
    ratingToDelete = await Rating.findOne({
      userId: userId,
      movieId: movieId,
    }).populate("userId", "ratings");
  } catch (err) {
    return next(
      new HttpError("The request failed while getting the rating.", 500)
    );
  }
  if (!ratingToDelete) {
    return next(
      new HttpError(
        "Could not find the rating with provided user and movie.",
        404
      )
    );
  }

  if (ratingToDelete.userId.id.toString() !== req.userData.userId) {
    return next(
      new HttpError("You are not allowed to delete this rating.", 401)
    );
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await ratingToDelete.remove({ session: sess });
    ratingToDelete.userId.ratings.pull(ratingToDelete);
    await ratingToDelete.userId.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(
      new HttpError("The request failed while deleting the rating.", 500)
    );
  }

  res.status(200).json({ rating: ratingToDelete.toObject({ getters: true }) });
};

exports.getAllRatings = getAllRatings;
exports.getRating = getRating;
exports.createRating = createRating;
exports.updateRating = updateRating;
exports.deleteRating = deleteRating;
