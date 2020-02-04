/* eslint-disable no-console */

/**
 * Format error response to request.
 * @param {string} message
 * @param {object} error
 * @param {object} res
 */
const handleResponseError = (message, error, res) => {
  console.error('[ERROR]:', error || message);
  return res.status(400).send({ message, error });
};

module.exports = { handleResponseError };
