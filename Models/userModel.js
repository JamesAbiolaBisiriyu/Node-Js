const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

//name, email, password, confirmPassword, photo
const  userSchema  = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Please enter your name!']
    },
    email:{
      type:String,
      required:[true, 'Please enter your email'],
      unique:true,
      lowercase:true,
      validate:[validator.isEmail,'Please enter a valid email'],
    },
    photo: String,
    password:{
      type:String,
      required:[true,'Please enter your password'],
      minlength: [8,'Password must be at least 8 characters'],
      select:false 
    },
    confirmPassword:{
      type:String,
      required:[true,'Please enter your confirm password'],
      validate: {
        //This validator will only work for save() & create( )
        validator: function(val){
          return val === this.password;
        },
        message: 'Passwords do not match',
      }
    },
    PasswordChangedAt: Date
});


userSchema.pre('save', async function(next){
  if (!this.isModified('password')) return //next();

  //encrypt the password before saving it
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.comparePasswordInDb = async function(pswd, pswdDb){
  return await bcrypt.compare(pswd, pswdDb);
    // return await bcrypt.compare(pswd, pswdDb);

}

userSchema.methods.isPasswordChanged = async function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt
    console.log(this.passwordChangedAt, JWTTimestamp ); 
  

  }
  return false
}

const user = mongoose.model('User', userSchema);

module.exports = user;