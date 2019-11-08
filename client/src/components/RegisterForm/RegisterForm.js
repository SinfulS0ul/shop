import React, { useState } from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { setCurrentUser, setFavorites } from '../../store/actions/actions';
import jwt_decode from 'jwt-decode';
import FormInput from '../FormInput/FormInput';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';


const RegisterForm = props => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const favorites = useSelector(state => state.favorites.favorites)

  const dispatch = useDispatch();

  const handleInputChange = e => {
    const target = e.target;
    const name = target.name;
    switch(name){
      case 'name': 
        setName(target.value);
        break;
      case 'email': 
        setEmail(target.value);
        break;
      case 'password': 
        setPassword(target.value);
        break;
      case 'confirmPassword': 
        setConfirmPassword(target.value);
        break;
    }
  }

  const onSubmit = e => {
    e.preventDefault();
    const user = {
      name,
      email,
      password,
      confirmPassword
    }
    axios
      .post('/api/users/register', user)
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
  
    return(
      <>
      <form 
        className='register-form'
        onSubmit = { onSubmit }
        noValidate
      >
          <p style={{fontSize: '22px'}}>Register</p>
          <FormInput 
            labelName='USERNAME' 
            name='name' 
            type='username'
            handleInputChange={handleInputChange} 
            errors={errors.name}
            placeholder='Tony Stark'
          />
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
          <FormInput 
            labelName='CONFIRM PASSWORD' 
            name='confirmPassword' 
            type='password' 
            handleInputChange={handleInputChange} 
            errors={errors.confirmPassword}
          />
          <div>
            <button
              type='submit'
            >
              Sign up
            </button>
          </div>
      </form>
        <div className='register-login-div'>
        I already have an account, 
        <NavLink to="/Login"
          className='nav-link'
          style={{ color: '#349A89'}}
        >
          LOG IN
        </NavLink>
      </div>
      </>
    )
};

export default withRouter(RegisterForm);