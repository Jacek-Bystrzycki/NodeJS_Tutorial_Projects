const User = require('../models/User.js');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      token: user.signToken(),
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError('Invalid email');
  }
  const passwordValid = await user.comparePasswords(password);
  if (!passwordValid) {
    throw new UnauthenticatedError('Invalid password');
  }
  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      token: user.signToken(),
    },
  });
};

const updateUser = async (req, res) => {
  const user = await User.findById(req.user.userId).select('-password');
  if (!user) throw new UnauthenticatedError('User not found');
  const updatedUser = await User.findOneAndUpdate(
    { email: user.email },
    {
      ...req.body,
    },
    { returnDocument: 'after' }
  );
  res.status(StatusCodes.OK).json({
    user: {
      name: updatedUser.name,
      email: updatedUser.email,
      lastName: updatedUser.lastName,
      location: updatedUser.location,
      token: updatedUser.signToken(),
    },
  });
};

module.exports = { register, login, updateUser };
