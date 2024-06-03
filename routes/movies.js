
const router = require("express").Router();
const { MongoClient } = require('mongodb');
const uri = process.env.mongoURI;
const client = new MongoClient(uri);

router.get("/movies", async (req, res) => {
 try {
     // Kết nối tới MongoDB
     await client.connect();
     console.log("Connected to MongoDB Atlas");

     // Truy cập tới cơ sở dữ liệu và collection
     const database = client.db('movieweb');
     const moviesCollection = database.collection('movies');

     const totalmovie = await moviesCollection.countDocuments();
     console.log("Total number of records in collection:", totalmovie);

     const page = parseInt(req.query.page) - 1 || 0;
     const limit = parseInt(req.query.limit) || 14;
     const search = req.query.search || "";

     let sort = req.query.sort || "rating";
     let genre = req.query.genre || "- All -";
     let year = req.query.year || "- All -";
     let average_rating = req.query.average_rating || "- All -";
     let age_rating = req.query.age_rating || "- All -";

     const genreOptions = [
         "Action", "Romance", "Fantasy", "Drama", "Crime",
         "Adventure", "Thriller", "Sci-fi", "Music", "Family",
     ];

     const yearOptions = [];
     const ratingOptions = [];
     const ageRatingOptions = [];

     genre = (genre === "- All -") ? genreOptions : req.query.genre.split(",");
     sort = req.query.sort ? req.query.sort.split(",") : [sort];

     let sortBy = {};
     // if (sort[1]) {
     //     sortBy[sort[0]] = sort[1];
     // } else {
     //     sortBy[sort[0]] = "desc";
     // }

     let filterOptions = {
         title: { $regex: search, $options: "i" },
         genre: { $in: genre }
     };
     if (year !== "- All -") {
         filterOptions.year = year;
     }
     if (average_rating !== "- All -") {
         filterOptions.average_rating = average_rating;
     }
     if (age_rating !== "- All -") {
         filterOptions.age_rating = age_rating;
     }

     const movies = await moviesCollection.find(filterOptions)
         .sort(sortBy)
         .skip(page * limit)
         .limit(limit)
         .toArray();

     const total = await moviesCollection.countDocuments(filterOptions);

     const response = {
         error: false,
         total,
         page: page + 1,
         limit,
         genres: genreOptions,
         years: yearOptions,
         average_rating: ratingOptions,
         age_rating: ageRatingOptions,
         movies,
     };
     console.log("Filter Options:", filterOptions);
     console.log('movies: ', movies);

     res.status(200).json(response);
 } catch (err) {
     console.log(err);
     res.status(500).json({ error: true, message: "Internal Server Error" });
 } 
});

module.exports = router;
