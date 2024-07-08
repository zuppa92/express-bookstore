const express = require("express");
const cors = require("cors");
const booksRoutes = require("./routes/books");
const ExpressError = require("./expressError");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/books", booksRoutes);

// 404 handler
app.use(function (req, res, next) {
  return next(new ExpressError("Not Found", 404));
});

// general error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});

module.exports = app;
