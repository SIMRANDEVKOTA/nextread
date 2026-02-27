const { User, Book, Review, UserBooks, Library, Category } = require('../src/models/index');

describe('NextRead: Index Model Relationships', () => {
    it('should have all models initialized', () => {
        expect(User).toBeDefined();
        expect(Book).toBeDefined();
        expect(Review).toBeDefined();
        expect(UserBooks).toBeDefined();
        expect(Library).toBeDefined();
        expect(Category).toBeDefined();
    });

    it('should have defined the belongsToMany relationship between User and Book', () => {
        expect(User.associations.Books).toBeDefined();
        expect(Book.associations.Users).toBeDefined();
    });
});