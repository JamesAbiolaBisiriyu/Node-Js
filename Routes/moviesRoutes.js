const express = require('express');
const moviesController = require('./../Controller/moviesController'); //imports the file that has the route handler function 
const authController = require('./../Controller/authController')


const router = express.Router(); 
//router.param('id', moviesController.checkId )
 router.route('/highest-rated').get(moviesController.getHighestRated, moviesController.getAllMovies)

router.route('/movie-stats').get(moviesController.getMoviesStats)

router.route('/movies-by-genre/:genre').get(moviesController.getMovieByGenre);


router.param('id', (req, res, next, value) => {
  console.log('Movie ID is  ' + value);
  next();
})  //the value param will store the value which the user passed for this ID parameter in the URL

router.route('/')   //moviesRouter is a middleware
.get(authController.protect, moviesController.getAllMovies)
.post(moviesController.createMovie)




//app.route('/api/v1/movies/:id')
router.route('/:id')  //param middleware
.get(moviesController.getMovie)
.patch(moviesController.updateMovie)
.delete(moviesController.deleteMovie)

module.exports = router; //exports the middleware router