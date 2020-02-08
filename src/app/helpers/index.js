/* eslint-disable no-console */

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

module.exports = { handleResponseError, operationError };
