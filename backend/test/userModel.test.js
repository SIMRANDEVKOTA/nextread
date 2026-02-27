const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();
const DataTypes = require('sequelize').DataTypes;

const UserModel = require('../src/models/User')(dbMock, DataTypes);

describe('User Model Unit Test', () => {
    it('should create a user with correct attributes', async () => {
        const user = await UserModel.create({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        });
        expect(user.username).toBe('testuser');
       expect(user.role.defaultValue).toBe('user');
expect(user.bio.defaultValue).toBe('');     // Checking default bio
    });
});