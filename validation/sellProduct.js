const Validator = require('validator');
const isEmpty = require('./is-emty'); 

module.exports = validateSellProductInput = data => {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.location = !isEmpty(data.location) ? data.location : '';
  
  if(isNaN(data.price) && !Validator.isEmpty(data.price)){
    errors.price = 'Price field contains invalid symbols';
  }

  if(Validator.isEmpty(data.location)){
    errors.location = 'Location field is required';
  }

  if(Validator.isEmpty(data.title)){
    errors.title = 'Title field is required';
  }

  return{
    errors,
    isValid: isEmpty(errors)
  };
};