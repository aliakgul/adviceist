const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const ratingSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    unique: false,
    ref: "User",
  },
  movieId: { type: Number, required: true, unique: false },
  rating: { type: Number, required: true },
});

ratingSchema.index({ userId: 1, movieId: 1 }, { unique: true });
ratingSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Rating", ratingSchema);
