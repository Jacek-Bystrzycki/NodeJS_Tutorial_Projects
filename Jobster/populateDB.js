require('dotenv').config();

const connectDB = require('./db/connect.js');
const Job = require('./models/Job.js');
const jsonJobs = require('./mock-data.json');
const jsonJobsDemo = require('./mock-data-demo.json');

const populateDB = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Job.deleteMany();
    await Job.create(jsonJobs);
    await Job.create(jsonJobsDemo);
    console.log('Success...');
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

populateDB();
