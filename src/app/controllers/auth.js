const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const secret = process.env.SECRET_JWT || 'churras-tri';
const secretRefresh = process.env.SECRET_JWT_REFRESH || 'churras-tri';
const getSegundsByDays = days => days * 86400;

const generateToken = (params = {}) => ({
  refreshToken: jwt.sign({ params }, secretRefresh, { expiresIn: getSegundsByDays(120) }),
  accessToken: jwt.sign({ params }, secret, { expiresIn: getSegundsByDays(7) }),
});

const authenticate = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user) return res.status(400).send({ error: 'User not found.' });
  if (!await bcrypt.compare(password, user.password)) {
    return res.status(400).send({ error: 'Invalid password.' });
  }

  user.password = undefined;

  return res.send({ ...user._doc, ...generateToken({ id: user._id }) });
};

const getNewToken = async (req, res) => {
  const { refreshToken } = req.body;
  const userId = jwt.verify(refreshToken, secretRefresh, (err, decoded) => {
    if (err) return res.status(400).send({ error: 'Token invalid' });
    return decoded.params.id;
  });

  const user = await User.findOne({ _id: userId });

  if (!user) return res.status(400).send({ error: 'User not found.' });
  return res.send({ ...generateToken({ id: user._id }) });
};

module.exports = { authenticate, getNewToken, generateToken };
