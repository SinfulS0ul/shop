import React from 'react';
import { withRouter } from 'react-router';
import DropdownCategories from '../DropdownCategories/DropdownCategories';
import './Filter.scss'

const Filter = props => {
  const handleInputChange = e => {
    const target = e.target;
    if(target.validity.valid){
      if(target.name === 'priceFrom')
        props.setPriceFrom(target.value);
      if(target.name === 'priceTo')
        props.setPriceTo(target.value);
      props.history.push('/Main/1')
    }
  }

  return (
    <div className='filter'>
      <DropdownCategories />
      <input
        pattern='[0-9]*'
        onChange={handleInputChange}
        placeholder='Price from (USD)'
        value={props.priceFrom}
        name='priceFrom'
      />
      <div className='line'/>
      <input 
        placeholder='Price to (USD)'
        pattern='[0-9]*'
        onChange={handleInputChange}
        value={props.priceTo}
        name='priceTo'
      />
    </div>
  )
}

export default withRouter(Filter);