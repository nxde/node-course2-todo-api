
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 5,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  tokens: [{
    access: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  }],
});

UserSchema.methods.toJSON = function (){
  const user = this;
  const userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
};

/*
UserSchema.methods.generateAuthToken = function (){
  const user = this;
  const access = 'auth';
  const token = jwt.sign({
    id: user._id.toHexString(),
    access,
  }, process.env.JWT_SECRET).toString();
  user.tokens.push({ access, token });

  return user.save().then(() => token);
};
*/

UserSchema.methods.generateAuthToken = async function (){
  const user = this;
  const access = 'auth';
  const token = jwt.sign({
    id: user._id.toHexString(),
    access,
  }, process.env.JWT_SECRET).toString();
  user.tokens.push({ access, token });

  await user.save();
  return token;
};

UserSchema.methods.removeToken = function (token){
  const user = this;
  return user.update({
    $pull: {
      tokens: { token },
    },
  });
};
/*
UserSchema.statics.findByToken = function (token){
  const User = this;
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e){
    // return new Promise((resolve,reject)=>{
    //     reject();
    // });


    return Promise.reject();// OR return Promise.reject(some err);
  }
  return User.findOne({
    _id: decoded.id,
    'tokens.token': token,
    'tokens.access': 'auth',
  });
};
*/

UserSchema.statics.findByToken = async function (token){
  const User = this;
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded.id,
      'tokens.token': token,
      'tokens.access': 'auth',
    });
    return user;
  } catch (e){
    throw e;
  }
};

/*
UserSchema.statics.findByCredentials = function (email, password){
  const User = this;

  return User.findOne({ email }).then((user) => {
    if (!user){
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res){
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};
*/

UserSchema.statics.findByCredentials = async function (email, password){
  const User = this;

  try {
    const user = await User.findOne({ email });
    if (!user){
      throw Error;
    }
    const res = await new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        resolve(res);
      });
    });
    if (!res){
      throw Error;
    }
    return user;
  } catch (e){
    throw Error;
  }
};

UserSchema.pre('save', function (next){
  const user = this;

  if (user.isModified('password')){
    // console.log('Pass modified');
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        // console.log('user before save: ', user);
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
