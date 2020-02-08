const Barbecue = require('../models/barbecue');
const { handleResponseError, operationError } = require('../helpers');

const errorMessage = operation => operationError(operation, 'Barbecues');
const PermissionErr = 'User without permission. Token not compatible with user';

const getAll = async (req, res) => {
  try {
    const { userId } = req;
    const barbecues = (await Barbecue.find({ participants: userId }));
    return res.status(200).send({ barbecues });
  } catch (error) { return handleResponseError(res, errorMessage('find'), error); }
};

const getById = async (req, res) => {
  try {
    const { userId, params: { id } } = req;
    const barbecues = Barbecue.findById(id);
    if (!barbecues.participants.includes(userId)) throw PermissionErr;
    return res.status(200).send({ barbecues });
  } catch (error) { return handleResponseError(res, errorMessage('find'), error); }
};

const insert = async (req, res) => {
  try {
    const { userId, body } = req;
    if (!body.participants || body.participants.length) body.participants = [];
    const newBarbecue = { ...body, owner: userId, participants: [...body.participants, userId] };
    const created = await Barbecue.create(newBarbecue);
    const barbecue = await Barbecue.findById(created._id).populate('participants', '-barbecues');
    return res.send(barbecue);
  } catch (error) { return handleResponseError(res, errorMessage('register'), error); }
};

const update = async (req, res) => {
  try {
    const { userId, params: { id } } = req.params;
    const barbecues = Barbecue.findById(id);
    if (!barbecues.participants.includes(userId)) throw PermissionErr;
    await Barbecue.findOneAndUpdate({ _id: id }, req.body);
    return res.status(204).send({ message: 'Barbecue updated with success.' });
  } catch (error) { return handleResponseError(res, errorMessage('update'), error); }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.userId !== id) throw PermissionErr;
    await Barbecue.remove({ _id: id });
    return res.status(204).send({ message: 'Barbecue removed with success.' });
  } catch (error) { return handleResponseError(res, errorMessage('remove'), error); }
};

module.exports = { getAll, getById, insert, remove, update };
