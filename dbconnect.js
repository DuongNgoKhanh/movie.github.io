const mongoose = require('mongoose');
const { MongoClient} = require('mongodb');
//const uri = "mongodb+srv://duong:EIRvSa9YNM9jkvwX@movieweb.tehyrrt.mongodb.net/?retryWrites=true&w=majority&appName=Movieweb";
const uri = process.env.mongoURI;
//const client = new MongoClient(uri);
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 60000, // 30 giây
    socketTimeoutMS: 60000 // 45 giây
});

const connectDB = async () => {
    try {
        await client.connect();

        console.log('MongoDB Anh quoc connected');
    } catch (error) {
        console.error('MongoDB connection failed', error);
        process.exit(1); // Dừng ứng dụng nếu kết nối thất bại
    }
};
mongoose.set('debug', true);
module.exports = connectDB;
