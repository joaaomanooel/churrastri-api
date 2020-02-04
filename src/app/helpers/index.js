/* eslint-disable no-console */

/**
 * Format error response to request.
 * @param {string} message
 * @param {object} error
 * @param {object} res
 */
const handleResponseError = (message, error, res) => {
  console.error(error);
  return res.status(400).send({ message, error });
};

module.exports = { handleResponseError };
