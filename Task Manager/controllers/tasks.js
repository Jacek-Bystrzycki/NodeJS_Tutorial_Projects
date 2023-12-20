const { Task } = require('../model/Task.js');
const asyncWrapper = require('../middleware/asyncWrapper.js');

const getAllTasks = asyncWrapper(async (req, res) => {
  const allTasks = await Task.find({});
  res.status(200).json({ allTasks });
});

const getTask = asyncWrapper(async (req, res) => {
  const { id: taskID } = req.params;
  const task = await Task.findOne({ _id: taskID });
  res.status(200).json({ task });
});

const addTask = asyncWrapper(async (req, res) => {
  // const task = await Task.create(req.body);
  const task = await new Task(req.body);
  res.status(201).json({ task });
});

const editTask = asyncWrapper(async (req, res) => {
  const task = await Task.findOneAndUpdate({ _id: req.params.id }, req.body, {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!task) {
    return res.status(404).json({ success: false, msg: 'not found' });
  }
  res.status(200).json({ task });
});

const deleteTask = asyncWrapper(async (req, res) => {
  const { id: taskID } = req.params;
  const task = await Task.deleteOne({ _id: taskID });
  if (!task) {
    return res.status(404).json({ msg: `No item with id: ${taskID}` });
  }
  const allTasks = await Task.find({});
  res.status(200).json({ msg: { type: 'Deleted', task } });
});

module.exports = { getAllTasks, getTask, addTask, editTask, deleteTask };
