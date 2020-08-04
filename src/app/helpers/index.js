/* eslint-disable no-console */

const nodemailer = require('nodemailer');
const mailConfig = require('../config/mail');

/**
 * Format error on operation
 * @param {string} operation
 * @param {string} schemaName
 */
const operationSuccess = (operation, schemaName) => {
  if (!operation || !schemaName) return 'Error to do operation.';
  return `${schemaName} ${operation} with success.`;
};

/**
 * Format error on operation
 * @param {string} operation
 * @param {string} schemaName
 */
const operationError = (operation, schemaName) => {
  if (!operation || !schemaName) return 'Error to do operation.';
  return `Error to ${operation} ${schemaName}.`;
};

/**
 * Format response error to request.
 * @param {string} message
 * @param {object} error
 * @param {object} res
 */
const handleResponseError = (res, message = operationError(), error) => {
  console.error('[ERROR]:', error || message);
  return res.status(400).send({ message, error });
};

const Mail = nodemailer.createTransport(mailConfig);

module.exports = { handleResponseError, operationError, operationSuccess, Mail };
