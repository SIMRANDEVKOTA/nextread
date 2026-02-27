const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();
const DataTypes = require('sequelize').DataTypes;

const ReviewModel = require('../src/models/Review')(dbMock, DataTypes);

describe('Review Model Unit Test', () => {
    it('should create a review with a rating and comment', async () => {
        const review = await ReviewModel.create({
            rating: 5,
            comment: 'Amazing read!'
        });
        expect(review.rating).toBe(5);
        expect(review.comment).toBe('Amazing read!');
    });
});