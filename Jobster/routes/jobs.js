const express = require('express');
const jobsRouter = express.Router();

const {
  getAllJobs,
  getJob,
  addJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobs.js');

jobsRouter.route('/').get(getAllJobs).post(addJob);
jobsRouter.route('/:id').get(getJob).patch(updateJob).delete(deleteJob);

module.exports = jobsRouter;
