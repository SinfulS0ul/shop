import React, { useState, useEffect } from 'react';
import Filter from '../Filter/Filter';
import ProductsList from '../ProductsList/ProductsList';
import PagePagination from '../PagePagination/PagePagination';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

const SearchPage = props => {
  const productsPerPage = 12;

  const [currentPage, setCurrentPage] = useState(1);
  const [currentProducts, setCurrentProducts] = useState([]);

  const showFavorites = useSelector(state => state.showFavorites.showFavorites);
  const favorites = useSelector(state => state.favorites.favorites);
  const foundProducts = useSelector(state => state.foundProducts.products);

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
    let currProductsArray = foundProducts;
    if(showFavorites)
      currProductsArray = currProductsArray.filter(products => favorites.includes(products._id));
    currProductsArray = currProductsArray.filter((product, i) => productPaginating().includes(i));
    setCurrentProducts(currProductsArray);
  }, [foundProducts, currentPage, showFavorites])

  return (
    <>
      <Filter />
      <div style={{margin: '0 19%'}}>
        <ProductsList productsArray={currentProducts}/>
        {foundProducts.length >= productsPerPage &&
        <PagePagination 
          pageCount={foundProducts.length/productsPerPage}
          currentPage={currentPage}
          component={'/Search'}
        />}
    </div>
    </>
  )
}

export default withRouter(SearchPage);