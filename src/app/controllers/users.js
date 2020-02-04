/* eslint-disable no-console */
const User = require('../models/user');
const { generateToken } = require('./auth');
const { handleResponseError } = require('../helpers');

const PermissionErr = 'User without permission. Token not compatible with user';

function operationError(operation) {
  if (!operation) return 'Error to do operation';
  return `Error to ${operation} user.`;
}

const getAll = async (_req, res) => {
  try {
    const users = await User.find();
    return res.status(200).send({ users });
  } catch (error) { return handleResponseError(operationError('find'), error, res); }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    return res.status(200).json({ user });
  } catch (error) { return handleResponseError(operationError('find'), error, res); }
};

const insert = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send({ error: 'User already exist.' });
    await User.create(req.body);
    const user = await User.findOne({ email });
    return res.send({ ...user, ...generateToken({ id: user._id }) });
  } catch (error) { return handleResponseError(operationError('register'), error, res); }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.userId !== id) throw new Error(PermissionErr);
    await User.findOneAndUpdate({ _id: id }, req.body);
    return res.status(204).send({ message: 'User updated with success.' });
  } catch (error) { return handleResponseError(operationError('update'), error, res); }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.userId !== id) throw new Error(PermissionErr);
    await User.remove({ _id: id });
    return res.status(201).send({ message: 'User removed with success.' });
  } catch (error) { return handleResponseError(operationError('remove'), error, res); }
};

module.exports = { getAll, getById, insert, update, remove };
