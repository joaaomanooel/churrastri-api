const { Router } = require('express');
const controller = require('../controllers/users');
const authMiddleware = require('../middleware/auth');

const baseUrl = '/users';

module.exports = Router()
  .get(baseUrl, controller.getAll)
  .post(baseUrl, controller.insert)
  .get(`${baseUrl}/:id`, controller.getById)
  .put(`${baseUrl}/:id`, authMiddleware, controller.update)
  .delete(`${baseUrl}/:id`, authMiddleware, controller.remove);
