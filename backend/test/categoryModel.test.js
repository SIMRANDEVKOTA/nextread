const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

// Define the mock for your Category model
const CategoryModel = dbMock.define('categories', {
  id: 1,
  name: 'Science Fiction'
});

describe('NextRead Unit Testing: Category Model', () => {
    
    // Validating the table name mapping
    it('should have the correct table name for categories', () => {
        expect(CategoryModel.name).toBe('categories');
    });

    it('should create a category with the correct attributes', async () => {
        const category = await CategoryModel.create({
            name: 'Science Fiction'
        });

        // Verifying the specific Category data
        expect(category.id).toBe(1);
        expect(category.name).toBe('Science Fiction');
        expect(typeof category.name).toBe('string');
    });

    it('should ensure the category name is a string', async () => {
        const category = await CategoryModel.create({
            name: 'Fantasy'
        });
        
        expect(category.name).toEqual(expect.any(String));
    });
});