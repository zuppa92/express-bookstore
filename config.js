require("dotenv").config();

const DB_URI = process.env.NODE_ENV === "test"
  ? "postgresql://localhost/books-test"
  : "postgresql://localhost/books";

const PORT = +process.env.PORT || 3000;

module.exports = {
  DB_URI,
  PORT
};
