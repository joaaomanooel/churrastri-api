const { Router } = require('express');
const controller = require('../controllers/auth');

const baseUrl = '/auth';

module.exports = Router()
  .post(baseUrl, controller.authenticate)
  .post(`${baseUrl}/refresh-token`, controller.getNewToken);
