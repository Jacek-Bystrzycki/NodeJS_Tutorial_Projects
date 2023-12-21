const { login } = require('../controllers/auth');
const { UnauthenticatedError } = require('../errors');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const authorize = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) throw new UnauthenticatedError('No Auth Header..');
  if (!authorization.startsWith('Bearer '))
    throw new UnauthenticatedError('Wrong Auth Header..');
  const token = authorization.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = payload;
    const user = await User.findById({ _id: userId }).select('-password');
    req.user = { userId: user._id, userName: user.name };
    next();
  } catch (error) {
    throw new UnauthenticatedError(error);
  }
};
module.exports = authorize;
