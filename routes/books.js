const express = require("express");
const jsonschema = require("jsonschema");
const Book = require("../models/book");
const bookSchema = require("../schemas/bookSchema.json");
const bookUpdateSchema = require("../schemas/bookUpdateSchema.json");
const ExpressError = require("../expressError");

const router = new express.Router();

// GET /books - get list of all books
router.get("/", async (req, res, next) => {
  try {
    const books = await Book.findAll();
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

// POST /books - create a new book
router.post("/", async (req, res, next) => {
  try {
    const validationResult = jsonschema.validate(req.body, bookSchema);
    if (!validationResult.valid) {
      const errors = validationResult.errors.map(error => error.stack);
      console.error("Validation errors:", errors); // Log validation errors
      throw new ExpressError(errors, 400);
    }

    const book = await Book.create(req.body);
    return res.status(201).json({ book });
  } catch (err) {
    if (err.code === '23505') { // Duplicate key error code
      return next(new ExpressError("ISBN already exists", 400));
    }
    console.error("Error creating book:", err); // Log general errors
    return next(err);
  }
});

// GET /books/:isbn - get details of a book by ISBN
router.get("/:isbn", async (req, res, next) => {
  try {
    const book = await Book.findOne(req.params.isbn);
    if (!book) {
      throw new ExpressError(`Book with ISBN ${req.params.isbn} not found`, 404);
    }
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

// PUT /books/:isbn - update existing book by ISBN
router.put('/:isbn', async (req, res, next) => {
  try {
    const validationResult = jsonschema.validate(req.body, bookUpdateSchema);
    if (!validationResult.valid) {
      const errors = validationResult.errors.map(err => err.stack);
      throw new ExpressError(errors, 400);
    }

    const book = await Book.update(req.params.isbn, req.body);
    if (!book) {
      throw new ExpressError(`Book with ISBN ${req.params.isbn} not found`, 404);
    }
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

// PATCH /books/:isbn - partial update existing book by ISBN
router.patch('/:isbn', async (req, res, next) => {
  try {
    const validationResult = jsonschema.validate(req.body, bookUpdateSchema);
    if (!validationResult.valid) {
      const errors = validationResult.errors.map(err => err.stack);
      throw new ExpressError(errors, 400);
    }

    const book = await Book.partialUpdate(req.params.isbn, req.body);
    if (!book) {
      throw new ExpressError(`Book with ISBN ${req.params.isbn} not found`, 404);
    }
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

// DELETE /books/:isbn - delete a book
router.delete("/:isbn", async (req, res, next) => {
  try {
    const book = await Book.findOne(req.params.isbn);
    if (!book) {
      throw new ExpressError(`Book with ISBN ${req.params.isbn} not found`, 404);
    }

    await Book.remove(req.params.isbn);
    return res.json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("Error deleting book:", err);
    return next(err);
  }
});




module.exports = router;
