require('dotenv').config();

const { connectToDatabase, closeDatabaseConnection } = require('../services/database');
const { describe, beforeAll, afterAll, it, expect } = require('@jest/globals');
describe('connectToDatabase', () => {
    beforeAll(() => {
        // Set up any necessary test environment configurations
    });

    afterAll(async() => {
        await closeDatabaseConnection();
    });

    it('should connect to the database successfully', async () => {
        // Call the connectToDatabase function
        const isConnected = await connectToDatabase();
        console.log('isConnected',isConnected )
        // Assert that the database connection was successful
        expect(isConnected).toBe(true);
    });
});
