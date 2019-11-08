import React from 'react';
import Product from '../Product/Product';
import './ProductsList.scss';

const ProductsList = props => {
  return (
    <div className='products-list'>
      {props.productsArray.map((product, i) => 
          <Product product={product} key={i}/>)}
    </div>
  )
}

export default ProductsList;