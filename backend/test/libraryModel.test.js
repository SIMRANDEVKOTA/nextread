const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();
const DataTypes = require('sequelize').DataTypes;

const LibraryModel = require('../src/models/Library')(dbMock, DataTypes);

describe('Library Model Unit Test', () => {
    it('should create a library entry with default status "Plan to Read"', async () => {
        const entry = await LibraryModel.create({ progress: 10 });
     expect(entry.status.defaultValue).toBe('Plan to Read');
        expect(entry.progress).toBe(10);
    });

    it('should allow valid ENUM values for status', async () => {
        const entry = await LibraryModel.create({ status: 'Completed' });
        expect(entry.status).toBe('Completed');
    });
});