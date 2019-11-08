import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FormInput from '../FormInput/FormInput';

const ResetPassword = props => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState('');
  const [submited, setSubmited] = useState(false);

  useEffect(() => {
    const {
      match: {
        params: { token },
      },
    } = props;
    console.log(token)
    axios
      .get(`/api/users/getResetUser/?resetPasswordToken=${token}`)
      .then(res => setName(res.data.name))
      .catch(err => setErrors({invalidToken: err.response.data}))
  }, [])

  const handleInputChange = e => {
    const target = e.target;
    if(target.name === 'password')
      setPassword(target.value)
    else
      setConfirmPassword(target.value)
  };

  const updatePassword = e => {
    e.preventDefault();
    const {
      match: {
        params: { token },
      },
    } = props;
    const userData = { name, password, confirmPassword, resetPasswordToken: token }
    axios
      .post('/api/users/resetPassword', userData)
      .then(() => {setSubmited(true); setErrors({})})
      .catch(err => 
        setErrors(err.response.data)
      )
  }

  return (
    <form 
      className='reset-password-form' 
      onSubmit={updatePassword}
      noValidate
    >
      {(errors.invalidToken && <p>Problem resetting password. Please send another reset link.</p>) ||
       (submited && <p>Password updated successfuly.</p>) ||
        <>
          <p>Reset Password</p>
          <FormInput
            labelName='PASSWORD'
            handleInputChange={handleInputChange}
            type='password'
            name='password'
            errors={errors.password}
          />
          <FormInput
            labelName='CONFIRM PASSWORD'
            handleInputChange={handleInputChange}
            type='password'
            errors={errors.confirmPassword}
          />
          <div>
            <button
              type='submit'
            >
              Continue
            </button>
          </div>
        </>
      }
    </form>
  );
}

export default ResetPassword;