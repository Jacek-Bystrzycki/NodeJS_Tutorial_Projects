const Job = require('../models/Job.js');
const { NotFoundError, BadRequestError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const getAllJobs = async (req, res) => {
  const createdBy = req.user.userId;
  const allJobs = await Job.find({ createdBy }).sort('createdAt');
  res.status(StatusCodes.OK).json({ Hits: allJobs.length, allJobs });
};

const getJob = async (req, res) => {
  const userId = req.user.userId;
  const jobId = req.params.id;
  const job = await Job.find({ createdBy: userId, _id: jobId });
  if (job.length < 1) throw new NotFoundError('Job not found..');
  res.status(StatusCodes.OK).json({ job });
};

const addJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json(job);
};

const updateJob = async (req, res) => {
  const userId = req.user.userId;
  const jobId = req.params.id;
  const { company, position } = req.body;
  if (company === '' || position === '')
    throw new BadRequestError('"Company" or "Position" cannot be empty');
  const job = await Job.findOneAndUpdate(
    { createdBy: userId, _id: jobId },
    req.body,
    (options = { returnDocument: 'after' })
  );
  if (!job) throw new NotFoundError('No job to update..');
  res.status(StatusCodes.ACCEPTED).json(job);
};

const deleteJob = async (req, res) => {
  const userId = req.user.userId;
  const jobId = req.params.id;
  const { deletedCount } = await Job.deleteOne({
    createdBy: userId,
    _id: jobId,
  });
  if (deletedCount === 0) throw new NotFoundError('No job to delete..');
  res.status(StatusCodes.ACCEPTED).send(`Deleted ${deletedCount} job(s)`);
};

module.exports = { getAllJobs, getJob, addJob, updateJob, deleteJob };
