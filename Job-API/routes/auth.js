const express = require('express');
const authRouter = express.Router();

const { register, login } = require('../controllers/auth.js');

authRouter.route('/register').post(register);
authRouter.route('/login').post(login);

// authRouter.post('/register', register);
// authRouter.post('/login', login);

module.exports = authRouter;
