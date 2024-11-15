// const fs = require('fs');
const { param } = require('../Routes/moviesRoutes')
const CustomError = require('../Utils/CustomError')
const Movie = require('./../Models/movieModel')
const ApiFeatures = require('./../Utils/ApiFeatures')
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');

exports.getHighestRated = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratings'

  next();
}

exports.getAllMovies = asyncErrorHandler (async (req, res, next)=>{  //exports route handler function
  
  // try{  
    const features = new ApiFeatures(Movie.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
    const movies = await features.query;

     const excludeFields = ['sort','page','limit','fields']
     const queryObj = {...req.query};     
     excludeFields.forEach((el)=> {
     delete queryObj[el]}) //delete the fields that are not
      
      
    // const movies = await Movie.find(queryObj); //using command prompt to pass query to get documents using query strings

    //  console.log(req.query);
    //  let queryStr = JSON.stringify(req.query)
    //  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match)=> `$${match}`);
    //  let queryObj = JSON.parse(queryStr)
    //  console.log(queryObj);

    //  if (queryObj.duration) {
    //   if (queryObj.duration.$gte) queryObj.duration.$gte = Number(queryObj.duration.$gte);
    //   if (queryObj.duration.$lte) queryObj.duration.$lte = Number(queryObj.duration.$lte);
    // }
    
    // if (queryObj.ratings) {
    //   if (queryObj.ratings.$gte) queryObj.ratings.$gte = Number(queryObj.ratings.$gte);
    //   if (queryObj.ratings.$lte) queryObj.ratings.$lte = Number(queryObj.ratings.$lte);
    // }
    
    // if (queryObj.price) {
    //   if (queryObj.price.$gte) queryObj.price.$gte = Number(queryObj.price.$gte);
    //   if (queryObj.price.$lte) queryObj.price.$lte = Number(queryObj.price.$lte);
    // }



     
    // let query = Movie.find(queryObj);

      // SORTING LOGIC
    //  if (req.query.sort){
    //   const sortBy = req.query.sort.split(',').join(' ');      
    //   query = query.sort(sortBy);
    //  } else{
    //   query = query.sort('-createdAt');
    //  }

     //LIMITING FIELDS
    //  if (req.query.fields){
    //   const fields = req.query.fields.split(',').join(' ');
    //   console.log(fields);      
    //   query = query.select(fields);
    //  }else{
    //   query = query.select('-__v');
    //  }

     //PAGINATION
    //  const page = req.query.page * 1 || 1;
    //  const limit = req.query.limit * 1 || 10;
    //  //PAGE 1: 1 - 10; PAGE 2: 11-20 ;  PAGE 3: 21 - 30
    //  const skip = (page - 1) * limit;
    //  query = query.skip(skip).limit(limit);

    //  if (req.query.page) {
    //     const moviesCount = await Movie.countDocuments();
    //     if (skip >= moviesCount) {
    //       throw new Error("No movies page found!");

          
    //     }
    //  }

    //  const movies = await query;
     //find ({duration: {$gte:148}. ratings: {$gte: 8.8}, price: {$lte: 12.99}})
     
    //Mongoose Special Method
    // const movies = await Movie.find()
    //   .where('duration')
    //   .gte(req.query.duration)
    //   .where('ratings')
    //   .gte(req.query.ratings)
    //   .where('price')
    //   .lte(req.query.price)
      
      res.status(200).json({
      status: 'success',
      length: movies.length,
      data: {
        movies
      }
    });
  // } catch(err){
    res.status(404).json({
      status: 'fail',
      message: err.message
    })
  // }
})

//Router Handling to Update Movie into the Api
exports.updateMovie = asyncErrorHandler (async (req, res, next)=>{                       //exports route handler function
  
  // try{
      const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
      if (!updatedMovie){
        const error = new CustomError('Movie with that ID is not found!', 404);
        return next(error);
       }
      res.status(200).json({
        status: 'success',
        data: {
          movie: updatedMovie
        }
      });
  // }catch(err){
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  // }
})

//Router for handling the delete request
exports.deleteMovie =asyncErrorHandler (async (req,res, next)=>{        //exports route handler function
  
  // try{
   const deletedMovie =  await Movie.findByIdAndDelete(req.params.id) 
    if (!deletedMovie){
      const error = new CustomError('Movie with that ID is not found!', 404);
      return next(error);
     }

    res.status(204).json({
      status: 'success',
      data: null
    })
  // }catch(err){
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  // }
})

//Router handling to GET SINGLE MOVIE FROM THE API
exports.getMovie = asyncErrorHandler (async (req, res, next)=>{ 
             //exports route handler function
           const movie = await Movie.findById(req.params.id);   //findById() is similar to the above code

           

             if (!movie){
              const error = new CustomError('Movie with that ID is not found!', 404);
              return next(error);
             }
  
  // try{

  

  res.status(200).json({
    status: 'success',
    data: {
      movie
    }
  });
// }catch(err){
  res.status(404).json({
    status: 'fail',
    message: err.message
  })
// }
  } )

  


  exports.createMovie = asyncErrorHandler (async (req, res, next) => {                 //exports route handler function
  
  //try {              //in the try block is where we write our codes that might throw some error
  const movie = await Movie.create(req.body);  //using the await keyword to wait for the promise to get resolved
  
  res.status(201).json({
    status:'success',
    data:{
      movie
    }
  })
  
//}
//catch(err){
    // res.status(400).json({
    //   status: 'fail',
    //   message: err.message
    // });
    const error = new CustomError(err.message, 404);
    next(error)
//}
})




exports.getMoviesStats = asyncErrorHandler (async (req, res, next)=>{
  // try {
      const stats = await Movie.aggregate([
        // { $match: {releaseDate: {$lte: new Date()}}},        
        { $match: {ratings: {$gte: 7}}},
        {$group: {
          _id: '$releaseYear',
          avgRatings: {$avg: '$ratings'},
          avgPrice: {$avg: '$price'},
          minPrice: {$min: '$price'},
          maxPrice: {$max: '$price'},
          totalPrice: {$sum: '$price'},
          movieCount: {$sum: 1}
        }},
        {$sort: {minPrice: 1}},
        // { $match: {maxPrice: {$gte: 19}}}

      ]);

      res.status(200).json({
        status:'success',
        count: stats.length,
        data:{
          stats
        }
      })
  // }
  //  catch (error) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  // }
})

exports.getMovieByGenre = asyncErrorHandler (async (req, res, next) =>  {
  // try {
    const genre = req.params.genre;
    const movies = await Movie.aggregate([
      {$unwind: '$genre'},
      {$group:{
        _id: '$genre',
        movieCount: {$sum: 1},
        movies: {$push: '$name'},
      }},
      {$addFields: {genre: '$_id'}},
      {$project: {_id: 0}},
      {$sort:{movieCount: -1}},
      // {$limit: 6}
      {$match: {genre: genre}},
    ]);
    res.status(200).json({
      status:'success',
      count: movies.length,
      data:{
        movies
      }
    })
    
  // } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  // }
})