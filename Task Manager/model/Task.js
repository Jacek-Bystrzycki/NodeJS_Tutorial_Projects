const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: [20, 'cannot be more tha 20 characters'],
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const Task = mongoose.model('Tasks', taskSchema);

module.exports = { Task };
