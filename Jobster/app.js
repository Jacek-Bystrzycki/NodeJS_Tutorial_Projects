require('dotenv').config();
require('express-async-errors');
const path = require('path');

const express = require('express');
const app = express();
const authorize = require('./middleware/authentication.js');

const helmet = require('helmet');
const xss = require('xss-clean');

const connectDB = require('./db/connect');
// routers
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.static(path.resolve(__dirname, './client/build')));

app.set('trust proxy', 1);
app.use(express.json());
app.use(helmet());
app.use(xss());

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authorize, jobsRouter);

app.get('*', (req, res) => {
  res
    .status(200)
    .sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
