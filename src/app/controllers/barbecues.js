const Barbecue = require('../models/barbecue');
const { handleResponseError, operationError, operationSuccess } = require('../helpers');

const errorMessage = operation => operationError(operation, 'Barbecues');
const successMessage = operation => operationSuccess(operation, 'Barbecues');
const PermissionErr = 'User without permission. Token not compatible with user';

const handlePaid = (b) => {
  const barbecue = b._doc;
  barbecue.participants = b.participants.map(p => ({ ...p._doc, paid: !!b.paid.includes(p._id) }));
  return barbecue;
};

const getAll = async (req, res) => {
  try {
    const { userId } = req;
    const data = await Barbecue
      .find({ participants: { $in: [userId] } })
      .populate('participants', 'name email username')
      .sort('date');

    const barbecues = data.map(handlePaid);
    return res.status(200).send(barbecues);
  } catch (error) { return handleResponseError(res, errorMessage('find'), error); }
};

const getById = async (req, res) => {
  try {
    const { userId, params: { id } } = req;
    const data = await Barbecue
      .findOne({ _id: id, $or: [{ participants: { $in: [userId] } }, { owner: userId }] })
      .populate('participants', 'name email username');
    const barbecues = handlePaid(data);
    return res.status(200).send(barbecues);
  } catch (error) { return handleResponseError(res, errorMessage('find'), error); }
};

const insert = async (req, res) => {
  try {
    const { userId, body } = req;
    if (!body.participants || !body.participants.length) body.participants = [];
    const participants = !body.participants.find(p => `${p}` === `${userId}`)
      ? [...body.participants, userId]
      : body.participants;
    const newBarbecue = { ...body, owner: userId, participants };
    const created = await Barbecue.create(newBarbecue);
    const barbecue = await Barbecue.findById(created._id).populate('participants', '-barbecues');
    return res.send(barbecue);
  } catch (error) { return handleResponseError(res, errorMessage('register'), error); }
};

const update = async (req, res) => {
  try {
    const { userId, params: { id }, body } = req;
    const barbecues = await Barbecue.findById(id).populate('participants', '-barbecues');
    if (!barbecues.participants && !barbecues.participants.includes(userId)) throw PermissionErr;
    if (!body.participants || !body.participants.length) body.participants = [userId];
    await Barbecue.findOneAndUpdate({ _id: id }, body);
    return res.status(204).send({ message: successMessage('updated') });
  } catch (error) { return handleResponseError(res, errorMessage('update'), error); }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const barbecue = await Barbecue.findById(id);
    if (`${req.userId}` !== `${barbecue.owner}`) throw PermissionErr;
    await Barbecue.deleteOne({ _id: id });
    return res.status(204).send({ message: successMessage('removed') });
  } catch (error) { return handleResponseError(res, errorMessage('remove'), error); }
};

module.exports = { getAll, getById, insert, remove, update };
