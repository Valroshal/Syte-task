require('dotenv').config();

const mongoose = require('mongoose').default;
const { MONGO_URI } = process.env;

const connectToDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connected!');
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
};

const closeDatabaseConnection = async () => {
    await mongoose.disconnect();
    console.log('Disconnected from the database');
};

module.exports = {
    connectToDatabase,
    closeDatabaseConnection
};
