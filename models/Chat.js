const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatsSchema = new Schema({
  usersIds: {
    type: Array,
    required: true
  },
  messagesId: {
    type: Array,
    required: true
  },
  itemId: {
    type: String,
    required: true
  },
  lastMessageDate: {
    type: String,
    required: true
  }
});

module.exports = Chat = mongoose.model('chats', ChatsSchema);
