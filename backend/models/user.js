const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  userName: { type: String, required: true, minlength: 2, unique: true },
  ratings: [{ type: mongoose.Types.ObjectId, required: true, ref: "Rating" }],
  topN: [
    {
      movieId: { type: Number, required: true },
      title: { type: String, required: true },
      imdbId: { type: Number, required: true },
      genre: { type: String, required: true },
    },
  ],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
