const mongoose = require('mongoose');

// URL kết nối đến MongoDB
//const uri = process.env.mongoURI;
const uri = "mongodb+srv://duong:<password>@movieweb.tehyrrt.mongodb.net/?retryWrites=true&w=majority&appName=Movieweb";
const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Anh quoc connected');
    } catch (error) {
        console.error('MongoDB connection failed', error);
        process.exit(1); // Dừng ứng dụng nếu kết nối thất bại
    }
};

module.exports = connectDB;
