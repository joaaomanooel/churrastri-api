const bcrypt = require('bcrypt');
const mongoose = require('../../database');

const { Schema } = mongoose;

async function encryptPassword(next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
}

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowerCase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
}).pre('save', encryptPassword);

module.exports = mongoose.model('User', UserSchema);
