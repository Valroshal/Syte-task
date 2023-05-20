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
    } catch (error) {
        console.error('Database connection failed:', error);
    }
};

module.exports = {
    connectToDatabase,
};
