const express = require("express");
const { check } = require("express-validator");

const usersControllers = require("../controllers/users-controllers");

const router = express.Router();

router.post(
  "/signup",
  [
    check("userName").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersControllers.signup
);
router.post(
  "/login",
  [check("email").not().isEmpty(), check("password").not().isEmpty()],
  usersControllers.login
);
router.get("/:userId", usersControllers.getCurrentUser);
router.patch(
  "/:userId/topn",
  [check("movies").not().isEmpty()],
  usersControllers.updateTopN
);

module.exports = router;
