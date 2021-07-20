const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// uncomment before deployment
// const path = require("path");

const HttpError = require("./models/http-error");
const usersRoutes = require("./routes/users-routes");
const ratingsRoutes = require("./routes/ratings-routes");

const app = express();

app.use(bodyParser.json());

// uncomment before deployment
// app.use(express.static(path.join("public")));

// comment before deployment
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

//root version
app.use("/api/users", usersRoutes);
app.use("/api/ratings", ratingsRoutes);

//development version
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/ratings", ratingsRoutes);

// uncomment before deployment
// app.use((req, res, next) => {
//   res.sendFile(path.resolve(__dirname, "public", "index.html"));
// });

// comment before deployment
app.use((req, res, next) => {
  return next(new HttpError("Could not find the route.", 404));
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fgjzg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    // uncomment before deployment
    app.listen(/* process.env.PORT || */ 5000);
  })
  .catch((err) => {
    console.log(err);
  });
