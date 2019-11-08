import React, { useState } from 'react';
import ReactModal from 'react-modal';
import './ChatWithSellerModal.scss'
import CloseIcon from '@material-ui/icons/Close';
import FormInput from '../FormInput/FormInput';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

ReactModal.setAppElement(document.getElementById('root'))

const ChatWithSellerModal = props => {
  const [message, setMessage] = useState('');
  const socket = props.socket;

  const handleInputChange = e => {
    setMessage(e.target.value);
  }

  const sendMessage = () => {
    const req = {
      text: message,
      date: Date.now(),
      senderId: props.currentUserId,
      receiverId: props.sellerId,
      itemId: props.product._id
    }

    axios
      .post('/api/messages/addMessage/', req)
      .then(res => {
        if(res.data.msg === 'Chat updated')
            socket.emit('sendMessage', { room: res.data.chatId, message: res.data.message });
        else
          axios
            .get('/api/messages/getChatById/', { params: { userId: props.currentUserId, chatId: res.data.chatId } })
            .then(chat => socket.emit('createNewRoom', { room: chat.data.receiverId, chatData: chat.data }));
        props.history.push('/Inbox');
      })
  }

  return (
    <ReactModal
      isOpen={props.showModal}
      className='chat-with-seller-modal'
      overlayClassName='overlay'
    > 
      <p style={{textAlign: 'center', fontSize: '22px'}}>Contact seller</p>
      <p className='subject'>Subject: {props.product.title} for {props.product.price}</p>
      <div className='user-info'>
        <div className='round'>
          <img src={props.seller.photo}/>
        </div>
        <p>
          {props.seller.name}
        </p>
      </div>
      <FormInput 
        labelName='MESSAGE'
        name='message'
        type='input'
        handleInputChange={handleInputChange}
        height={10}
        placeholder='Your message'
      />
      <button
        onClick={sendMessage}
      >
        SUBMIT
      </button>
      <CloseIcon 
        style={{ position: 'absolute', fontSize: '2vw', right:'5px', top:'5px', cursor: 'pointer'}}
        onClick={() => props.setShowModal(false)}
      />
    </ReactModal>
  )
}

export default withRouter(ChatWithSellerModal);