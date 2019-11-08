const Validator = require('validator');
const isEmpty = require('./is-emty'); 

module.exports = validateRegisterInput = data => {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : '';

  if(!Validator.isLength(data.name, {min: 4, max: 18})){
    errors.name = 'Name must be between 4 and 18 characters';
  }

  if(!Validator.isLength(data.password, {min: 5, max: 12})){
    errors.password = 'Password must be between 5 and 12 characters';
  } 

  if(Validator.isEmpty(data.name)){
    errors.name = 'Name field is required';
  }

  if(Validator.isEmpty(data.email)){
    errors.email = 'Email field is required';
  }

  if(!Validator.isEmail(data.email)){
    errors.email = 'Invalid email';
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