import React, { useState, useEffect } from 'react';
import './Message.scss'

const Message = props => {
  const [date, setDate] = useState('')

  useEffect(() => {
    const newDate = new Date(props.message.date);
    const year = `${newDate.getFullYear()}`;
    const month = newDate.getMonth() < 9? `0${newDate.getMonth() + 1}` : `${newDate.getMonth()}`;
    const day = newDate.getDate() < 10? `0${newDate.getDate()}` : `${newDate.getDate()}`;

    const hours = newDate.getHours() < 10? `0${newDate.getHours()}` : `${newDate.getHours()}`;
    const minutes = newDate.getMinutes() < 10? `0${newDate.getMinutes()}` : `${newDate.getMinutes()}`;
    setDate(`${day}/${month}/${year} ${hours}:${minutes}`)
  }, [])

  return (
    <div className={props.userId === props.message.user? 'message-right' : 'message-left'}>
      <div className='bubble'>
        {props.message.text}
      </div>
      <span>
        {date}
      </span>
    </div>
  )
}

export default Message;