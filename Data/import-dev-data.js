const mongoose = require('mongoose');
const dotenv = require ('dotenv');
const fs = require('fs');
dotenv.config({path: './config.env'});//in order to use the connection string from the env variable we need to use this line of code
const Movie = require('./../Models/movieModel') //we also require the movieModels file

//CONNECTS TO MONGODB
mongoose.connect(process.env.LOCAL_CONN_STR, {
  useNewUrlParser: true
}).then((conn)=>{
console.log('DB Connection Successful');
}).catch((error)=>{
  console.log('Some Error Has Surfaced');
});


//READ MOVIES.JSON FILE
const movies = JSON.parse(fs.readFileSync('./Data/movies.json', 'utf-8')); //returns an array and assigns the value into movies cariable


//DELETES EXISTING MOVIE DOCUMENTS FROM THE COLLECTION
const deleteMovies = async () => {
  try {
    await Movie.deleteMany();
    console.log('data successfully Deleted');
  }catch(err){
    console.log(err.message);
  }
process.exit();

}


//IMPORTS MOVIE DATA TO MONGODB COLLECTION

const importMovies = async () => {
  try {
    await Movie.create(movies);
    console.log('data successfully Imported');
  }catch(err){
    console.log(err.message);
  }
process.exit();

}


if (process.argv[2] === '--import') {
  importMovies();
}
if (process.argv[2] === '--delete') {
  deleteMovies();
}


//console.log(process.argv);  //extracts the option which we have passed while running the script