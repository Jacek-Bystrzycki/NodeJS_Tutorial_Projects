require('dotenv').config();
const express = require('express');
const app = express();
const tasksRoutes = require('./routes/tasks.js');
const connectDB = require('./db/connect.js');
const { notFound } = require('./middleware/not-found.js');
const errorHandrelMiddleware = require('./middleware/error-handler.js');

const port = 3000;

app.use(express.json());
app.use(express.static('./public'));

app.use('/api/v1/tasks/', tasksRoutes);

app.use(notFound);
app.use(errorHandrelMiddleware);

const startServer = async () => {
  await connectDB(process.env.MONGO_URI);
  console.log('DB connected...');
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
  });
};

startServer();
