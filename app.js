const { count } = require('console');
const express = require('express');
const morgan = require('morgan');

const moviesRouter = require('./Routes/moviesRoutes'); //importing the router middleware
const authRouter = require('./Routes/authRouter')
const CustomError = require('./Utils/CustomError')
const { fail } = require('assert');
const globalErrorhandler = require('./Controller/errorController')

let app = express();

const logger = function (req, res, next){
  console.log('Custom middleware Called');
  next();
}
app.use(express.json()) //middleware is a function that can modify the incoming request data, its called 
//middleware because it stands in between the request and response 

if (process.env.NODE_ENV === 'development') {
app.use(morgan('dev')) //morgan is a middleware that logs the incoming requests, it returns a function that will act as a middleware function
}
app.use(express.static('./public'))  //serves Static files
app.use(logger);//logger does not need to be called but passed as it is a middleware function (three arguments)
app.use((req, res, next)=> {
  req.requestedAt = new Date().toISOString();
  next()
})



app.use('/api/v1/movies', moviesRouter); //making use of the middleware,  we don't want the middleware to be applied to all requests except for specific URL, so the first argument is the path where we want it to be applied, known as mounting routes 
app.use('/api/v1/users', authRouter);
app.all('*', (req, res, next) => {  //To always be defined as the last route, because it matches all the URL 
  // res.status(404).json({
  //   status: 'error',
  //   message: `Cant find ${req.originalUrl} on the server`
  // })
  // const err = new Error(`Cant find ${req.originalUrl} on the server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  const err = new CustomError(`Cant find ${req.originalUrl} on the server`, 404);
  next(err)
});


app.use(globalErrorhandler);
module.exports = app; //exports app object