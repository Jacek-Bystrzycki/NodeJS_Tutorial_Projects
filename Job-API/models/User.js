const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide User Name'],
    minlenth: 6,
    maxlength: 20,
  },
  email: {
    type: String,
    required: [true, 'Please provide User E-mail'],
    match: [
      /([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)+/,
      'Please provide Valid E-mail',
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide User Password'],
    minlenth: 8,
  },
});

//Create PRE function to hash password before sending to DB
//Using callback - need to use Next()!!!
UserSchema.pre('save', function (next) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(this.password, salt, (err, hashPass) => {
      this.password = hashPass;
      next();
    });
  });
});

//Without Next() it can return a promise
// UserSchema.pre('save', function () {
//   return bcrypt
//     .genSalt(10)
//     .then((salt) => bcrypt.hash(this.password, salt))
//     .then((hashPass) => (this.password = hashPass));
// });

// OR using async/await
// UserSchema.pre('save', async function () {
// const salt = await bcrypt.genSalt(10);
// this.password = await bcrypt.hash(this.password, salt);
// });

UserSchema.methods.signToken = function () {
  return jwt.sign(
    { userId: this._id, userName: this.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

UserSchema.methods.comparePasswords = async function (candidatePassowrd) {
  const isMatch = await bcrypt.compare(candidatePassowrd, this.password);
  return isMatch;
};

module.exports = mongoose.model('users', UserSchema);
