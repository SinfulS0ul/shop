import React, { useState } from 'react';
import './SellProductForm.scss';
import SellProductInputs from '../SellProductInputs/SellProductInputs';


const SellProductForm = props => {
  const [errors, setErrors] = useState({});

  return (
    <div className='sell-product__form'>
      <SellProductInputs 
        component='SellProductForm'
        errors={errors}
        setErrors={setErrors}
      />
    </div>
  )
}

export default SellProductForm;
