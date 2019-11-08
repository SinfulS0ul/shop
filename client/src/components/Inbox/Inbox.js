import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Message from '../Message/Message';
import './Inbox.scss';

const Inbox = props => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const userId = useSelector(state => state.auth.user.id);
  const socket = props.socket;

  let chatRef = useRef();

  socket.on('receiveMessage', message => {
    setMessages([...messages, message]);
  })

  socket.on('updateRooms', () => {
    axios
      .get('/api/messages/getChats', { params: { userId }})
      .then(res => setChats(res.data.sort((a,b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate))))
  })

  useEffect(() => {
    axios
      .get('/api/messages/getChats', { params: { userId }})
      .then(res => setChats(res.data.sort((a,b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate))))
  }, [userId]);

  useEffect(() => {
    if(currentChat){
      socket.emit('create', currentChat._id);
      axios
        .get('/api/messages/getMessagesOfChat', { params: { chatId: currentChat._id }})
        .then(res => setMessages(res.data))
    }
  }, [currentChat]);

  useEffect(() => {
    if(messages.length > 0)
      setLoading(false)
  }, [messages]);

  useEffect(() => {
      if (chatRef.current){
        chatRef.current.scrollTo(0, chatRef.current.scrollHeight)
        window.scrollTo({
          top: chatRef.current.offsetTop
        })
      }
    }, [!loading]
  );

  const sendMessage = () => {
    if(message && message.trim().length){
      const req = {
        text: message,
        date: new Date(),
        senderId: userId,
        receiverId: currentChat.receiverId,
        itemId: currentChat.itemId
      }

      axios
        .post('/api/messages/addMessage/', req)
        .then(socket.emit('sendMessage', { room: currentChat._id, message: { text: req.text, date: req.date, user: req.senderId } }));
      setMessage('');
    }
  }

  return (
    <div className='inbox'>
      <div className='chats-list'>
        {
          chats.map((chat, i) => 
            <div
              className='chat-item'
              key={i} 
              onClick={() => {
                if(currentChat !== chat)
                  setLoading(true);
                  setCurrentChat(chat);
              }}
            >
            <p>
              {chat.productTitle}
            </p>
            <p style={{color: 'grey'}}>
              {chat.productLocation}
            </p>
            </div>
        )}
      </div>
      {
        loading === false &&
        <div className='chat-window'>
          <div className='user-info'>
            <div className='round'>
              <img src={currentChat.photo}/>
            </div>
            <p>{currentChat.userName}</p>
          </div>
          <div className='messages-window'
            ref={chatRef}
          >
            { 
              messages.length > 0 &&
              messages
                .sort((a,b) => new Date(a.date) - new Date(b.date))
                .map((message, i) => <Message key={i} message={message} userId={userId}/>)
            }
          </div>
          <input
            onChange={e => setMessage(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && sendMessage()}
            placeholder='Type your message here...'
            value={message}
          />
        </div>
      }
    </div>
  )
}

export default Inbox;