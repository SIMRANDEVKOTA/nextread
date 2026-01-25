const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

// Define the mock for your NextRead Bookstore
const BookModel = dbMock.define('books', {
  id: 1,
  title: 'The Cruel Prince',
  author: 'Holly Black',
  genre: 'Fantasy',
  rating: 4.5
});

describe('NextRead Unit Testing: Models', () => {
    // This matches your friend's "correct table name" test style
    it('should have the correct table name for books', () => {
        expect(BookModel.name).toBe('books');
    });

    it('should create a book with correct NextRead attributes', async () => {
        const book = await BookModel.create({
            title: 'The Cruel Prince',
            author: 'Holly Black',
            genre : 'Fantasy',
            rating: 4.5
        });

        // Verifying your specific bookstore data
        expect(book.id).toBe(1);
        expect(book.title).toBe('The Cruel Prince');
        expect(typeof book.rating).toBe('number');
    });
});