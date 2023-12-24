const Job = require('../models/Job.js');
const {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
} = require('../errors');
const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');
const moment = require('moment');

const getAllJobs = async (req, res) => {
  const queryObject = {
    createdBy: req.user.userId,
  };
  if (req.query.status !== 'all') queryObject.status = req.query.status;
  if (req.query.jobType !== 'all') queryObject.jobType = req.query.jobType;
  if (req.query.search) {
    queryObject.position = { $regex: req.query.search, $options: 'i' };
  }

  let result = Job.find(queryObject);

  let sort;
  switch (req.query.sort) {
    case 'latest':
      sort = '-createdAt';
      break;
    case 'oldest':
      sort = 'createdAt';
      break;
    case 'a-z':
      sort = 'position';
      break;
    default:
      sort = '-position';
      break;
  }

  result = result.sort(sort);

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const allJobs = await result.limit(limit).skip(skip);
  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({ totalJobs, numOfPages, jobs: allJobs });
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

const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  stats = stats.reduce((acc, curr) => {
    const { _id, count } = curr;
    acc[_id] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format('MMM Y');
      return { count, date };
    })
    .reverse();

  res.status(StatusCodes.OK).json({
    defaultStats,
    monthlyApplications,
  });
};

module.exports = {
  getAllJobs,
  getJob,
  addJob,
  updateJob,
  deleteJob,
  showStats,
};
