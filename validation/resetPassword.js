const Validator = require('validator');
const isEmpty = require('./is-emty'); 

module.exports = validateResetPasswordInput = data => {
  let errors = {};

  data.password = !isEmpty(data.password) ? data.password : '';
  data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : '';

  if(!Validator.isLength(data.password, {min: 5, max: 12})){
    errors.password = 'Password must be between 5 and 12 characters';
  } 

  if(Validator.isEmpty(data.password)){
    errors.password = 'Password field is required';
  }

  if(!Validator.equals(data.password, data.confirmPassword)){
    errors.confirmPassword = 'Passwords doesnt match';
  }

  if(Validator.isEmpty(data.confirmPassword)){
    errors.confirmPassword = 'Confirm Password field is required';
  }

  return{
    errors,
    isValid: isEmpty(errors)
  };
};