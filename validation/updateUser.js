const Validator = require('validator');
const isEmpty = require('./is-emty'); 

module.exports = validateUpdateUserInput = data => {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name : '';
  data.phoneNumber = !isEmpty(data.phoneNumber) ? data.phoneNumber : '';

  if(!Validator.isEmpty(data.name) && !Validator.isLength(data.name, {min: 4, max: 18})){
    errors.name = 'Name must be between 4 and 18 characters';
  }

  if(!Validator.isEmpty(data.phoneNumber) && !Validator.isMobilePhone(data.phoneNumber, 'uk-UA')){
    errors.phoneNumber = 'Invalid phone number';
  } 

  return{
    errors,
    isValid: isEmpty(errors)
  };
};