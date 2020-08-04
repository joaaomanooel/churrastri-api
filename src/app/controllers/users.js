const User = require('../models/user');
const { generateToken } = require('./auth');
const { handleResponseError, operationError } = require('../helpers');
const { jobsKeys } = require('../constants');
const Queue = require('../lib/queue');

const PermissionErr = 'User without permission. Token not compatible with user';
const errorMessage = operation => operationError(operation, 'User');

const getAll = async (_req, res) => {
  try {
    const users = await User.find().sort('name').populate('Barbecues');
    return res.status(200).send(users);
  } catch (error) { return handleResponseError(res, errorMessage('find'), error); }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.userId !== id) throw PermissionErr;
    const user = await User.findOne({ _id: id });
    return res.status(200).json(user);
  } catch (error) { return handleResponseError(res, errorMessage('find'), error); }
};

const insert = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return handleResponseError(res, 'User already exist.');
    const { _doc: user } = await User.create(req.body);
    await Queue.add(jobsKeys.SignupMail, { user });

    return res.send({ ...user, ...generateToken({ id: user._id }) });
  } catch (error) { return handleResponseError(res, errorMessage('register'), error); }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.userId !== id) throw PermissionErr;
    await User.findOneAndUpdate({ _id: id }, req.body);
    return res.status(204).send({ message: 'User updated with success.' });
  } catch (error) { return handleResponseError(res, errorMessage('update'), error); }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.userId !== id) throw PermissionErr;
    await User.findOneAndDelete({ _id: id });
    return res.status(204).send({ message: 'User removed with success.' });
  } catch (error) { return handleResponseError(res, errorMessage('remove'), error); }
};

module.exports = { getAll, getById, insert, update, remove };
