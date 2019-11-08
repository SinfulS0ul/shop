const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessagesSchema = new Schema({
  user: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
});

module.exports = Message = mongoose.model('messages', MessagesSchema);
