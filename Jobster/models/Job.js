const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Please provide comany name'],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, 'Please provide position name'],
      maxlength: 50,
    },
    status: {
      type: String,
      enum: ['interview', 'declined', 'pending'],
      default: 'pending',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'remote', 'intership'],
      defualt: 'full-time',
    },
    jobLocation: {
      type: String,
      default: 'my-city',
      reguired: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('jobs', JobSchema);
