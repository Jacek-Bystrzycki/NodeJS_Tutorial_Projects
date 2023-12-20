const routes = require('express').Router();
const {
  getAllTasks,
  getTask,
  addTask,
  editTask,
  deleteTask,
} = require('../controllers/tasks.js');

routes.route('/').get(getAllTasks).post(addTask);
routes.route('/:id').get(getTask).patch(editTask).delete(deleteTask);

module.exports = routes;
