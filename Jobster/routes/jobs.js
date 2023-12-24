const express = require('express');
const jobsRouter = express.Router();
const { testUser } = require('../middleware/testDemo.js');

const {
  getAllJobs,
  getJob,
  addJob,
  updateJob,
  deleteJob,
  showStats,
} = require('../controllers/jobs.js');

jobsRouter.route('/').get(getAllJobs).post(testUser, addJob);
jobsRouter.route('/stats').get(showStats);
jobsRouter
  .route('/:id')
  .get(getJob)
  .patch(testUser, updateJob)
  .delete(testUser, deleteJob);

module.exports = jobsRouter;
