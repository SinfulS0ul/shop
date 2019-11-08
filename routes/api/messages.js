const express = require('express');

const router = express.Router();

const Message = require('../../models/Message');
const Chat = require('../../models/Chat');
const User = require('../../models/User');
const Product = require('../../models/Product');

router.get('/test', (req, res) => res.json({
  msg: "Messages Works"
}));

const createMessage = (req, res, next) => {

  const newMessage = new Message({
    user: req.body.senderId,
    text: req.body.text,
    date: req.body.date
  });

  newMessage
    .save()
    .then(message => {
      req.messageId = message._id;
      req.messageDate = message.date;
      next();
    });
}

// @route    POST api/messages/addMessage
// @desc     Add message

router.post('/addMessage', createMessage, (req, res) => {
  Chat
    .findOne({
      usersIds: {
        $all: [req.body.senderId, req.body.receiverId]
      },
      itemId: req.body.itemId
    })
    .then(chat => {
      if (chat === null) {
        const newChat = new Chat({
          usersIds: [req.body.senderId, req.body.receiverId],
          messagesId: [req.messageId],
          itemId: req.body.itemId,
          lastMessageDate: req.messageDate
        });

        newChat
          .save()
          .then(chat => res.status(200).send({
            chatId: chat._id
          }))
      } else {
        chat.messagesId = [...chat.messagesId, req.messageId];
        chat.lastMessageDate = req.messageDate;
        chat
          .save()
          .then(() => res.status(200).send({
            msg: 'Chat updated',
            message: { text: req.body.text, user: req.body.senderId, date: req.body.date },
            chatId: chat._id
          }))
      }
    })
    .catch(err => console.log(err))
})

// @route    GET api/messages/getChats
// @desc     Get all chats with user

router.get('/getChats', (req, res) => {
  Chat
    .find({
      usersIds: {
        $all: [req.query.userId]
      }
    })
    .then(async chats => {
      let newChat = [];
      await Promise.all(chats.map(async (chat, i) => {
        newChat[i] = {
          ...chat
        }._doc;
        const id =
          chat.usersIds[0] === req.query.userId ?
          chat.usersIds[1] : chat.usersIds[0];
        await User
          .findOne({
            _id: id
          })
          .then(user => {
            delete newChat[i].usersIds;
            newChat[i].receiverId = id;
            newChat[i].userName = user.name;
            newChat[i].photo = user.photo;
          });
        await Product
          .findOne({
            _id: chat.itemId
          })
          .then(product => {
            newChat[i].itemId;
            newChat[i].receiverId = id;
            newChat[i].productTitle = product.title;
            newChat[i].productLocation = product.location;
          });
      }));
      res.send(newChat)
    })
    .catch(err => console.log(err))
})

// @route    GET api/messages/getChatById
// @desc     Get chat by id

router.get('/getChatById', (req, res) => {
  Chat
    .findOne({
      _id: req.query.chatId
    })
    .then(async chat => {
      let newChat = [];
      newChat = {
        ...chat
      }._doc;
      const id =
        chat.usersIds[0] === req.query.userId ?
        chat.usersIds[1] : chat.usersIds[0];
      await User
        .findOne({
          _id: id
        })
        .then(user => {
          delete newChat.usersIds;
          newChat.receiverId = id;
          newChat.userName = user.name;
          newChat.photo = user.photo;
        });
      await Product
        .findOne({
          _id: chat.itemId
        })
        .then(product => {
          delete newChat.itemId;
          newChat.receiverId = id;
          newChat.productTitle = product.title;
          newChat.productLocation = product.location;
        });
      res.send(newChat);
    })
    .catch(err => console.log(err))
})

// @route    GET api/messages/getMessagesOfChat
// @desc     Get all messages of chat

router.get('/getMessagesOfChat', (req, res) => {
  Chat
    .findOne({
      _id: req.query.chatId
    })
    .then(chat => {
      const idArr = Array.from(chat.messagesId);
      Message
        .find({_id: { $in: [
          ...idArr
        ]}})
        .then(messages => res.send(messages))
    })
    .catch(err => console.log(err))
})

module.exports = router;