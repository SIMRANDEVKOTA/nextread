const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();
const DataTypes = require('sequelize').DataTypes;

const UserBooksModel = require('../src/models/UserBooks')(dbMock, DataTypes);

describe('UserBooks (Junction) Model Unit Test', () => {
    it('should track reading progress correctly', async () => {
        const ub = await UserBooksModel.create({
            status: 'reading',
            currentPage: 50,
            totalPages: 300
        });
        expect(ub.status).toBe('reading');
        expect(ub.currentPage).toBe(50);
        expect(ub.totalPages).toBe(300);
    });
});