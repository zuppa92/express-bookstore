document.addEventListener('DOMContentLoaded', () => {
    const addBookForm = document.getElementById('addBookForm');
    const messageDiv = document.getElementById('message');
    const bookListDiv = document.getElementById('bookList');

    addBookForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const isbn = document.getElementById('isbn').value;
        const amazon_url = document.getElementById('amazon_url').value;
        const author = document.getElementById('author').value;
        const language = document.getElementById('language').value;
        const pages = parseInt(document.getElementById('pages').value); // Convert to integer
        const publisher = document.getElementById('publisher').value;
        const title = document.getElementById('title').value;
        const year = parseInt(document.getElementById('year').value); // Convert to integer

        try {
            const response = await axios.post('http://localhost:3000/books', {
                isbn, amazon_url, author, language, pages, publisher, title, year
            });

            if (response.status === 201) {
                messageDiv.textContent = 'Book added successfully!';
                messageDiv.className = 'success';

                // Clear form fields
                addBookForm.reset();

                // Reload the book list
                loadBooks();
            }
        } catch (error) {
            messageDiv.textContent = 'Failed to add book. ' + error.response.data.error.message.join(', ');
            messageDiv.className = 'error';
        }
    });

    const loadBooks = async () => {
        try {
            const response = await axios.get('http://localhost:3000/books');
            const books = response.data.books;

            bookListDiv.innerHTML = '';
            books.forEach(book => {
                const bookDiv = document.createElement('div');
                bookDiv.className = 'book';
                bookDiv.innerHTML = `
                    <p><strong>ISBN:</strong> ${book.isbn}</p>
                    <p><strong>Title:</strong> ${book.title}</p>
                    <p><strong>Author:</strong> ${book.author}</p>
                    <p><strong>Publisher:</strong> ${book.publisher}</p>
                    <p><strong>Year:</strong> ${book.year}</p>
                `;
                bookListDiv.appendChild(bookDiv);
            });
        } catch (error) {
            bookListDiv.textContent = 'Failed to load books.';
        }
    };

    loadBooks();
});



