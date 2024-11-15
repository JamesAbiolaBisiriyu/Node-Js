
const dotenv = require('dotenv');  //#48 require the .env package and stores in variable dotenv
dotenv.config({path: './config.env'}); //#48 we pass an object in the dotenv, and in the object we specify a path property, which is the path of the config.env file
const mongoose = require('mongoose');

process.on('uncaughtException', (err)=>{
  console.log(err.name, err.message) ;
  console.log('Uncaught Exception occurred! Shutting Down.........');  

    
})

const app = require('./app');

// console.log(app.get('env'));  // #47. Logging the environment variable 
console.log(process.env);


/* =========== CONNECTION TO MONGO DB DATABASE============== */
mongoose.connect(process.env.LOCAL_CONN_STR, {
  useNewUrlParser: true
}).then((conn)=>{
// console.log(conn);
console.log('DB Connection Successful');
})
// .catch((error)=>{
//   console.log('Some Error Has Surfaced');
// });

// const testMovie = new Movie({
//   name: 'Intersection',
//   description: 'Action packed Drama, with adventures and thrillers',
//  duration: 180
// });

// testMovie.save().then(doc=> {
//   console.log(doc);
// }).catch(err => {
//   console.log('Error Happened  ' + err);
// }); //the save method creates a document with above details in the data base, a movie collection will be created in the data base, and in the 
//collection, the above doc will be saved, the save method returns us a promise, we consume the promise using, .then() method

// CREATES A SERVER
const port = process.env.PORT || 3000; //Making use of the port variable, reading the port from the environment variable and also using its default value as 3000
const server = app.listen(port, ()=>{       //in order to use the listen method, we need to import this app object 
console.log('server has started........');
}) 

process.on('unhandledRejection', (err)=>{
  console.log(err.name, err.message) ;
  console.log('Unhandled rejection occurred! Shutting Down.........');  

  server.close(()=> {
  process.exit(1);
  })  
})




