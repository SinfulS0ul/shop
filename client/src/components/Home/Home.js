import React, { useState, useEffect } from 'react';
import Filter from '../Filter/Filter';
import ProductsList from '../ProductsList/ProductsList';
import PagePagination from '../PagePagination/PagePagination';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = props => {
  const productsPerPage = 12;

  const [currentPage, setCurrentPage] = useState(1);
  const [currentProducts, setCurrentProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');

  const products = useSelector(state => state.products.products);
  const showFavorites = useSelector(state => state.showFavorites.showFavorites);
  const favorites = useSelector(state => state.favorites.favorites);

   useEffect(() => {
    const {
      match: {
        params: { page },
      },
    } = props;
    setCurrentPage(page);
   }, [props.match.params])
  
  const productPaginating = () => {
    let productsNumberList = [];
    for(let i = productsPerPage * (currentPage - 1); i < productsPerPage * currentPage; i++)
      productsNumberList.push(i);
    return productsNumberList;
  }

  useEffect(() => {
    let currProductsArray = products;
    if(showFavorites){
      currProductsArray = currProductsArray.filter(products => favorites.includes(products._id));
      setAllProducts(currProductsArray)
    }
    else
      setAllProducts(products)
  }, [products, showFavorites])

  useEffect(() => {
    let products = allProducts;
    if(priceFrom){
      products = products.filter(product => 
        product.price !== 'No Price' && +product.price.substring(1) >= +priceFrom
      );
    }
    if(priceTo)
      products = products.filter(product => 
        product.price !== 'No Price' && +product.price.substring(1) <= +priceTo
      )
    setFilteredProducts(products);
    setCurrentProducts(products.filter((product, i) => productPaginating().includes(i)))
  }, [allProducts, priceFrom, priceTo, currentPage])


  return (
    <>
      <Filter 
        setPriceFrom={setPriceFrom}
        setPriceTo={setPriceTo}
        priceFrom={priceFrom}
        priceTo={priceTo}
      />
      <div style={{margin: '0 19%'}}>
        <ProductsList productsArray={currentProducts}/>
      </div>
      {filteredProducts.length > productsPerPage &&
      <PagePagination 
        pageCount={filteredProducts.length/productsPerPage}
        currentPage={currentPage}
        component={'/Main'}
      />}
    </>
  )
}

export default withRouter(Home);