const express = require('express');
const authRouter = express.Router();
const { testUser } = require('../middleware/testDemo.js');
const authorize = require('../middleware/authentication.js');
const rateLimiter = require('express-rate-limit');
const { register, login, updateUser } = require('../controllers/auth.js');

const apiLimiter = rateLimiter({
  windowsMs: 15 * 60 * 1000,
  max: 10,
  message: {
    msg: 'To many request from this IP, please try again after 15 minutes',
  },
});

authRouter.route('/register').post(apiLimiter, register);
authRouter.route('/login').post(apiLimiter, login);
authRouter.route('/updateUser').patch(authorize, testUser, updateUser);

// authRouter.post('/register', register);
// authRouter.post('/login', login);
// authRouter.patch('/updateUser', tstUser, updateUser);

module.exports = authRouter;
