const User = require('../models/User.js');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.name }, token: user.signToken() });
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
  res
    .status(StatusCodes.OK)
    .json({ user: { name: user.name }, token: user.signToken() });
};

module.exports = { register, login };
