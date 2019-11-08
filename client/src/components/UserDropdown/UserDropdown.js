import React, { useState } from 'react';
import './UserDropdown.scss';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUser } from '../../store/actions/actions';
import { withRouter } from 'react-router-dom';

const UserDropdown = props => {
  const [displayMenu, setDisplayMenu] = useState(false);

  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();

  const logOut = () => {
    localStorage.removeItem('jwtToken');
    dispatch(setCurrentUser({}));
    setDisplayMenu(false);
    props.history.push('/Login');
  }

  return (
    <div className='user-dropdown'>
      <div 
        className='round'
        onClick={() => setDisplayMenu(!displayMenu)}
      >
        <img src={user.photo}/>
      </div>
      {displayMenu ? (
        <ul className='user-dropdown__list'>
          <li className='user-info'>
            <div
              className='user-info__round'
            >
              <img src={user.photo}/>
            </div>
            <div>
              <p style={{fontSize: '13px', fontWeight: 'bold'}}>{user.name}</p>
              <p style={{fontSize: '10px', color: '#979797'}}>{user.email}</p>
              <p 
                style={{fontSize: '13px', fontWeight: 'bold', color: '#349A89', padding: '5px 0', cursor: 'pointer'}}
                onClick={() => {props.history.push(`/users/${user.id}/1`); setDisplayMenu(false);}}
              >Profile</p>
            </div>
          </li>
          <li 
            style={{fontSize: '14px', color: '#349A89', cursor: 'pointer'}}
            onClick={() => {props.history.push('/Inbox'); setDisplayMenu(false);}}
          >INBOX</li>
          <li 
            style={{fontSize: '14px', color: '#349A89', cursor: 'pointer'}}
            onClick={() => {props.history.push('/EditProfile'); setDisplayMenu(false);}}
          >EDIT PROFILE</li>
          <div className='line'/>
          <li 
            style={{fontSize: '14px', color: '#349A89', cursor: 'pointer'}}
            onClick={logOut}
          >LOGOUT</li>
        </ul>
      ) :
        (
          null
        )
      }
    </div>

  );
}

export default withRouter(UserDropdown);