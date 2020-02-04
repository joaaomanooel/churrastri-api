/* eslint-disable import/no-dynamic-require, global-require */
const { Router } = require('express');
const path = require('path');
const fs = require('fs');

const router = Router();

fs
  .readdirSync(__dirname)
  .filter((file) => ((file.indexOf('.')) !== 0 && (file !== 'index.js')))
  .forEach((file) => router.use(require(path.resolve(__dirname, file))));

module.exports = router;
