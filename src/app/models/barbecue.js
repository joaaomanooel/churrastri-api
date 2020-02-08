const mongoose = require('../../database');

const { Schema } = mongoose;

const UserSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  description: {
    type: String,
  },
  price: {
    type: Schema.Types.Number,
    required: true,
    default: 0,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
});

module.exports = mongoose.model('Barbecue', UserSchema);
