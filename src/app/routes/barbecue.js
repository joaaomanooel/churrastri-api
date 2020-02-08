const { Router } = require('express');
const controller = require('../controllers/barbecues');
const authMiddleware = require('../middleware/auth');

const baseUrl = '/barbecues';

module.exports = Router()
  .get(baseUrl, authMiddleware, controller.getAll)
  .post(baseUrl, authMiddleware, controller.insert)
  .get(`${baseUrl}/:id`, authMiddleware, controller.getById)
  .put(`${baseUrl}/:id`, authMiddleware, controller.update)
  .delete(`${baseUrl}/:id`, authMiddleware, controller.remove);
