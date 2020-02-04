/* eslint-disable no-console */
const User = require('../models/user');

const { generateToken } = {}; // require('./auth');
const PermissionErr = 'User without permission. Token not compatible with user';

function operationError(operation) {
  if (!operation) return 'Error to do operation';
  return `Error to ${operation} user.`;
}

const getAll = async (_req, res) => {
  try {
    const users = await User.find();
    return res.status(200).send({ users });
  } catch (err) {
    console.error(err);
    return res.status(400).send({ error: operationError('find') });
  }
};

const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ _id: id });
    return res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    return res.status(400).send({ error: operationError('find') });
  }
};

const insert = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send({ error: 'User already exist.' });
    const user = await User.create(req.body);
    return res.send({ ...user, access_token: generateToken({ id: user._id }) });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: operationError('register') });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.userId !== id) throw new Error(PermissionErr);
    await User.findOneAndUpdate({ _id: id }, req.body);
    return res.status(204).send({ message: 'User updated with success.' });
  } catch (err) {
    console.error(err);
    return res.status(400).send({ error: operationError('update') });
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.userId !== id) throw new Error(PermissionErr);
    await User.remove({ _id: id });
    return res.status(201).send({ message: 'User removed with success.' });
  } catch (err) {
    console.error(err);
    return res.status(400).send({ error: operationError('remove') });
  }
};

module.exports = { getAll, getById, insert, update, remove };
