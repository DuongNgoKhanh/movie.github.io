const mongoose = require('mongoose');
const { MongoClient} = require('mongodb');
const uri = process.env.mongoURI;
const client = new MongoClient(uri);

// URL kết nối đến MongoDB
// const mongoURI = 'mongodb://0.0.0.0:27017/dbconnect';

const connectDB = async () => {
    try {
        await client.connect();

        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed', error);
        process.exit(1); // Dừng ứng dụng nếu kết nối thất bại
    }
};

module.exports = connectDB;
