const User = require('./../Models/userModel');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');
const jwt = require('jsonwebtoken');
const CustomError = require('./../Utils/CustomError');
// const { token } = require('morgan');
// const util = require('util')

// const signToken = id => {
  // return  jwt.sign({id}, process.env.SECRET_STR, {
    // expiresIn: Number(process.env.LOGIN_EXPIRES)
  // })
// }

exports.signup = asyncErrorHandler (async (req, res, next) => {
  const newUser = await User.create(req.body);

  const token = jwt.sign({id: newUser._id}, process.env.SECRET_STR, {
    expiresIn: process.env.LOGIN_EXPIRES
  })

  

  res.status(201).json({
    status: 'success',
    data: {
      token, 
      user: newUser
    }
  });
});

exports.login = asyncErrorHandler (async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;


  // const {email, password} = req.body;
  // CHECKS IF EMAIL & PASSWORD IS PRESENT IN REQUEST BODY
  if (!email || !password){
    const error = new CustomError('Please provide email ID & password for login in!', 400);
    return next(error); 
  }
  res.status(200).json({
    status: 'success',
    token: ''    
   
})
  

//   CHECK IF USER EXIST WITH GIVEN EMAIL
  const user = await User.findOne({ email }).select('+password');

//   const isMatch = await user.comparePasswordInDb(password, user.password);

// CHECK IF THE USER EXISTS & PASSWORD MATCHES

//   if (!user || !(await user.comparePasswordInDb(password, user.password))){
//     const error = new CustomError('Incorrect Email or Password', 400);
//     return next(error); 
//   }


//   const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token: '',
    user
   
})


// exports.protect = asyncErrorHandler(async(req,res,next) => {
  //1. We read the token to check if it exist 
  // const testToken = req.headers.authorization;
  // let token;
  // if (testToken && testToken.startsWith('Bearer')) {
  //    token = testToken.split(' ')[1];
  // }
  // if (!token){
  //  return next(new CustomError ('You are not logged in!', 401))
  // }
  
  //2. validate the token
  // const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);
  // console.log(decodedToken);
  

  //3. check if the user exist in the database
  //     const user = await User.findById(decodedToken.id);


  //     if (!user) {
  //       const error = new CustomError(' The User with given Token does not exist', 401);
  //       return next(error);
  //     }
      
  // //4. check if the user changed password after the token is issued
  // user.isPasswordChanged(decodedToken.iat);

  //5. Allow user to access to access route
  // next();
})