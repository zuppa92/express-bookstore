const request = require("supertest");
const app = require("../app");
const db = require("../db");

afterAll(async () => {
  await db.end();
});

describe("GET /books", () => {
  test("It should respond with an array of books", async () => {
    const response = await request(app).get("/books");
    expect(response.statusCode).toBe(200);
    expect(response.body.books).toBeInstanceOf(Array);
  });
});

describe("POST /books", () => {
  test("It should create a new book", async () => {
    const newBook = {
      isbn: "1234567890",
      amazon_url: "http://amazon.com/example",
      author: "John Doe",
      language: "English",
      pages: 300,
      publisher: "Example Publisher",
      title: "Example Book",
      year: 2021
    };
    const response = await request(app).post("/books").send(newBook);
    expect(response.statusCode).toBe(201);
    expect(response.body.book).toHaveProperty("isbn");
  });

  test("It should not create a book with invalid data", async () => {
    const invalidBook = {
      isbn: "1234567890",
      amazon_url: "not-a-url", // Invalid URL
      author: "John Doe",
      language: "English",
      pages: 300,
      publisher: "Example Publisher",
      title: "Example Book",
      year: 2021
    };
    const response = await request(app).post("/books").send(invalidBook);
    expect(response.statusCode).toBe(400);
    expect(response.body.error.message).toContain("instance.amazon_url does not conform to the \"uri\" format");
  });
});

describe("GET /books/:isbn", () => {
  test("It should respond with the details of a single book", async () => {
    const response = await request(app).get("/books/1234567890");
    expect(response.statusCode).toBe(200);
    expect(response.body.book).toHaveProperty("isbn");
  });

  test("It should return 404 if book not found", async () => {
    const response = await request(app).get("/books/nonexistent");
    expect(response.statusCode).toBe(404);
  });
});

describe("PUT /books/:isbn", () => {
  test("It should update an existing book", async () => {
    const updatedBook = {
      amazon_url: "http://amazon.com/example-updated",
      author: "John Doe Updated",
      language: "English",
      pages: 320,
      publisher: "Example Publisher Updated",
      title: "Example Book Updated",
      year: 2022
    };
    const response = await request(app).put("/books/1234567890").send(updatedBook);
    expect(response.statusCode).toBe(200);
    expect(response.body.book).toHaveProperty("isbn");
  });

  test("It should not update a book with invalid data", async () => {
    const invalidBook = {
      amazon_url: "not-a-url", // Invalid URL
      author: "John Doe Updated",
      language: "English",
      pages: 320,
      publisher: "Example Publisher Updated",
      title: "Example Book Updated",
      year: 2022
    };
    const response = await request(app).put("/books/1234567890").send(invalidBook);
    expect(response.statusCode).toBe(400);
    expect(response.body.error.message).toContain("instance.amazon_url does not conform to the \"uri\" format");
  });
});

describe("PATCH /books/:isbn", () => {
  test("It should partially update an existing book", async () => {
    const partialUpdate = {
      pages: 350
    };
    const response = await request(app).patch("/books/1234567890").send(partialUpdate);
    expect(response.statusCode).toBe(200);
    expect(response.body.book).toHaveProperty("pages", 350);
  });

  test("It should not partially update a book with invalid data", async () => {
    const invalidUpdate = {
      amazon_url: "not-a-url" // Invalid URL
    };
    const response = await request(app).patch("/books/1234567890").send(invalidUpdate);
    expect(response.statusCode).toBe(400);
    expect(response.body.error.message).toContain("instance.amazon_url does not conform to the \"uri\" format");
  });
});

describe("DELETE /books/:isbn", () => {
  test("It should delete a book", async () => {
    const response = await request(app).delete("/books/1234567890");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Book deleted successfully" });
  });

  test("It should return 404 if book not found", async () => {
    const response = await request(app).delete("/books/nonexistent");
    expect(response.statusCode).toBe(404);
  });
});
