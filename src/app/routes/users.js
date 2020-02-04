const { Router } = require('express');
const controller = require('../controllers/users');
const authMiddleware = require('../middleware/auth');

module.exports = Router()
  .get('/users', controller.getAll)
  .post('/users', controller.insert)
  .get('/users/:id', controller.getById)
  .put('/users/:id', authMiddleware, controller.update)
  .delete('/users/:id', authMiddleware, controller.remove);
