const express = require("express");
const { check } = require("express-validator");

const ratingsControllers = require("../controllers/ratings-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/:userId", ratingsControllers.getAllRatings);
router.get("/:userId/:movieId", ratingsControllers.getRating);

router.use(checkAuth);

router.post(
  "/:userId/:movieId",
  [check("rating").not().isEmpty()],
  ratingsControllers.createRating
);
router.patch(
  "/:userId/:movieId",
  [check("rating").not().isEmpty()],
  ratingsControllers.updateRating
);
router.delete("/:userId/:movieId", ratingsControllers.deleteRating);

module.exports = router;
