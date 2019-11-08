import React, { useState } from 'react';
import FormInput from '../FormInput/FormInput';
import { withRouter } from 'react-router-dom';
import isEmpty from '../../constants/isEmpty';
import axios from 'axios';

const ResetPasswordForm = props => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [submited, setSubmited] = useState(false);

  const handleInputChange = e => {
    setEmail(e.target.value);
  }

  const onSubmit = e => {
    e.preventDefault();
    const user = {
      email
    }
    console.log(submited)
    axios
      .post('/api/users/forgotPassword', user)
      .then(res => res.status === 200? setErrors({}):'')
      .then(setSubmited(true))
      .catch(err => 
        setErrors(err.response.data)
      );
  }

  return (
    <>
      <form
        className='reset-password-form'
        autoComplete='off'
        onSubmit={onSubmit}
        noValidate
      >
        <p style={{fontSize: '22px'}}>Restore Password</p>
        <FormInput 
          labelName='EMAIL' 
          name='email' 
          type='email' 
          handleInputChange={handleInputChange}
          errors={errors.email}
        />
        {submited && isEmpty(errors) && <p style={{fontSize: '13px'}}>We've sent you an email with instructions for restoring your password.</p>}
        <div>
          <button
            type='submit'
          >
            Continue
          </button>
        </div>
      </form>
    </>
  )
};
export default withRouter(ResetPasswordForm);
