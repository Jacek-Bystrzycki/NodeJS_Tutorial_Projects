require('dotenv').config();

const express = require('express');
const app = express();
require('express-async-errors');
const routes = require('./routes/products.js');

const connectDB = require('./db/connect.js');

const notFound = require('./middleware/not-found.js');
const errorHandler = require('./middleware/error-handler.js');

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`<h1>Store API</h1><a href="/api/v1/products">Products route</a>`);
});

app.use('/api/v1/products', routes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log('Connected to DB...');
    app.listen(port);
    console.log('Server is listening on port ' + port + '...');
  } catch (error) {
    console.log(error);
  }
};

start();
