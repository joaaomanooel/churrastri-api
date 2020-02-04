/* eslint-disable func-names */
const bcrypt = require('bcrypt');
const mongoose = require('../../database');

const { Schema } = mongoose;

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
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  barbecues: [{
    type: Schema.Types.ObjectId,
    ref: 'Barbecues',
    unique: true,
  }],
});

UserSchema.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

module.exports = mongoose.model('User', UserSchema);
