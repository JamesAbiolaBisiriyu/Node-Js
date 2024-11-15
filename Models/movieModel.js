const mongoose = require('mongoose');
const fs = require('fs');
const { kMaxLength } = require('buffer');
const validator = require('validator')

const movieSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: [true, 'Movie name is required'],
    unique: true,  // Ensures two movie documents don't have the same name in the database movie collection
    maxlength : [100, "Movie name must not have more than 100 character"],
    minlength : [4, "Movie Name must have at Least 4 characters"],
    trim: true, // Removes whitespace before and after the movie name
    // validate: [validator.isAlpha, "Name Should only include Alphabet"]
  },
  description: {
    type: String,  // Corrected to type: String
    required:[true, 'Description is required field'],
    trim: true
  }, 
  duration: {
    type: Number,
    required: [true, 'Duration is required']
  },
  ratings: {
    type: Number,
    // min: [1, 'Rating must be at least 1'],
    // max: [10, 'Rating must be at most 10 or Lesser'],
    validate: {
      validator: function (value) {
        return value >= 1 && value <= 10;
      },
      message: "Ratings ({VALUE}) should be above 1 and Below 10"
    }
   
  },
  totalRating: {
    type: Number,
  },
  releaseYear: {
    type: Number,
    required: [true, 'Release year is required'],
  },
  releaseDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Sets the default value of createdAt to the current date and time
    select: false
  },
  genre: {
    type: [String],
    required: [true, 'Genre is a required field'],
  //   enum: { values:  [
  //     "Action",
  //     "Adventure",
  //     "Animation",
  //     "Biography",
  //     "Comedy",
  //     "Crime",
  //     "Documentary",
  //     "Drama",
  //     "Family",
  //     "Fantasy",
  //     "Historical",
  //     "Horror",
  //     "Musical",
  //     "Mystery",
  //     "Romance",
  //     "Sci-Fi",
  //     "Sports",
  //     "Thriller",
  //     "War",
  //     "Western"
    
  //   ],
  // message: 'This Genre Does not exist'
  // },
  },
  directors: {
    type: [String],
    required: [true, 'Director is a required field']
  },
  coverImage: {
    type: String,
    required: [true, 'Cover image is required'],
  },
  cast: {
    type: [String],
    required: [true, 'Cast is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  createdBy: String
},  {

  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

movieSchema.virtual('durationInHours').get(function() {
  return this.duration / 60;
});

//EXECUTED BEFORE THE DOCUMENT IS SAVED IN DB
//.save() or .create()
movieSchema.pre('save', function (next) {
  this.createdBy = 'James';  //updates the document before being saved in the database 
  console.log(this);
  next();
})

movieSchema.post('save', function (doc, next) {
  const content = `A new movie document with name ${doc.name} has been created by ${doc.createdBy}\n`
  fs.writeFileSync('./Log/log.txt', content, {flag: 'a'}, (err)=>{
    console.log(err.message);
  });
  next();
})

//QUERY MIDDLEWARE
movieSchema.pre(/find/, function (next) {
  this.find({releaseDate: {$lte: Date.now()}});
  this.startTime = Date.now();
  next();
})

movieSchema.post(/find/, function (docs, next) {
  this.find({releaseDate: {$lte: Date.now()}});
  this.endTime = Date.now();

  const content = `Query Took ${this.endTime-this.startTime} milliseconds to fetch the Documents`
  fs.writeFileSync('./Log/log.txt', content, {flag: 'a'}, (err)=>{
    console.log(err.message);
  });


  next();
})

movieSchema.pre('aggregate', function (next) {
  console.log(this.pipeline().unshift({$match: {releaseDate: {$lte: new Date}}}));  
  next();
})


// movieSchema.pre('findOne', function (next) {
//   this.find({releaseDate: {$lte: Date.now()}});
//   next();
// })

// Based on the schema, we can create a model
const Movie = mongoose.model('Movie', movieSchema); // Using this model, we can create documents in our database, query them, update and delete them 

module.exports = Movie;  // Exports movie model
