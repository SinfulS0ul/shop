import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './LoginForm.scss';
import { setCurrentUser, setFavorites } from '../../store/actions/actions';
import { withRouter, NavLink } from 'react-router-dom';
import FormInput from '../FormInput/FormInput';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

const LoginForm = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const favorites = useSelector(state => state.favorites.favorites);

  const dispatch = useDispatch();

  const handleInputChange = e => {
    const target = e.target;
    const name = target.name;
    name === 'email' ? setEmail(target.value) : setPassword(target.value);
  }

  const onSubmit = e => {
    e.preventDefault();
    const user = {
      email,
      password
    }

    axios
      .post('/api/users/login', user)
      .then(res => {
        const { token } = res.data;
        localStorage.setItem('jwtToken', token);
        const decoded = jwt_decode(token);
        dispatch(setCurrentUser(decoded));
        axios
          .post('/api/users/updateUserFavorites', { userId: decoded.id, favorites })
          .then(res => setFavorites(res.data))
      })
      .then(() => {setErrors({}); props.history.push('/Main/1')})
      .catch(err => 
        setErrors(err.response.data)
      )
  }
  return (
    <>
      <form
        className='login-form'
        onSubmit={onSubmit}
        noValidate
      >
        <p style={{fontSize: '22px'}}>Login</p>
        <FormInput 
          labelName='EMAIL' 
          name='email' 
          type='email' 
          handleInputChange={handleInputChange} 
          errors={errors.email}
          placeholder='Example@gmail.com'
        />
        <FormInput 
          labelName='PASSWORD' 
          name='password' 
          type='password'
          handleInputChange={handleInputChange} 
          errors={errors.password}
        />
        <p style={{textAlign: 'right', padding: 0}}>
        <NavLink 
          to='/RestorePassword'
          className='nav-link'
          style={{ color: '#8C8C8C'}}
        >Don’t remember password?
        </NavLink>
        </p>
        <div>
          <button
            type='submit'
          >
            Continue
          </button>
        </div>
      </form>
      <div className='register-login-div'>
          I have no account,
          <NavLink to='/Register'
            className='nav-link'
            style={{ color: '#349A89'}}
          >
            REGISTER NOW
          </NavLink>
      </div>
    </>
  )
};

export default withRouter(LoginForm);