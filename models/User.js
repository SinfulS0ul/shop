const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  favorites: {
    type: Array,
    required: false
  },
  photo: {
    type: String,
    required: true
  },
  resetPasswordToken: {
    type: String,
    required: false
  },
  resetPasswordExpires: {
    type: String,
    required: false
  },
  products: {
    type: Array,
    required: true
  }
});

module.exports = User = mongoose.model('users', UserSchema)
