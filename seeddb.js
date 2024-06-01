const { MongoClient} = require('mongodb');
const uri = "mongodb+srv://duong:EIRvSa9YNM9jkvwX@movieweb.tehyrrt.mongodb.net/?retryWrites=true&w=majority&appName=Movieweb";
const path = require('path');
const fs = require('fs');

//var commentsPath = 'C:/Users/DELL/Downloads/HotelBooking-main/server/movieweb.comments.json';
//var invoicesPath = 'C:/Users/DELL/Downloads/MovieWebsite-Project_29-5/MovieWeb/json/movieweb.invoices.json';
//var moviesPath = 'C:/Users/DELL/Downloads/MovieWebsite-Project_29-5/MovieWeb/json/movieweb.movies.json';
//var newcommentPath = 'C:/Users/DELL/Downloads/MovieWebsite-Project_29-5/MovieWeb/json/movieweb.newcomment.json';
//var ordersPath = 'C:/Users/DELL/Downloads/MovieWebsite-Project_29-5/MovieWeb/json/movieweb.orders.json';
var userPath = 'C:/Users/DELL/Downloads/MovieWebsite-Project_29-5/MovieWeb/json/movieweb.user.json';

async function readFile(){
    var file = path.resolve(userPath);
    console.log(`File is being read: ${file}`);
    
    // Read JSON files
    const fileData = fs.readFileSync(file);
    const json = JSON.parse(fileData.toString());
    return json;
}
async function insertData(client, data) {
  const result = await client.db("movieweb").collection("user").insertMany(data);
  console.log("Inserted data: " + result);
  return result;
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    console.log("You successfully connected to MongoDB!");

    const jsonDatas = await readFile();
    var datas = [];
    jsonDatas.forEach( jsonData=>{ 
     datas.push({
      username: jsonData.username,
      password: jsonData.password,
      type: jsonData.type,
      watchlist: jsonData.watchlist,
      thumbnail_path: jsonData.thumbnail_path
    })});
    await insertData(client, datas);
    console.log("Inserted all data successfully!");  

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
