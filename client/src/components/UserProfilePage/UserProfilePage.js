import React, { useState, useEffect } from 'react';
import ProductsList from '../ProductsList/ProductsList';
import PagePagination from '../PagePagination/PagePagination';
import axios from 'axios';
import isEmpty from '../../constants/isEmpty';
import './UserProfilePage.scss';
import UserProfileBlocks from '../UserProfileBlocks/UserProfileBlocks';

const UserProfilePage = props => {
  const productsPerPage = 8;

  const [currentPage, setCurrentPage] = useState(1);
  const [currentProducts, setCurrentProducts] = useState([]);
  const [userProducts, setUserProducts] = useState([]);
  const [userData, setUserData] = useState({});
  const [userId, setUserId] = useState('');

  const productPaginating = () => {
    let productsNumberList = [];
    for(let i = productsPerPage * (currentPage - 1); i < productsPerPage * currentPage; i++)
      productsNumberList.push(i);
    return productsNumberList;
  }

  useEffect(() => {
    const {
      match: {
        params: { page },
      },
    } = props;
    setCurrentPage(page);
   }, [props.match.params.page])

  useEffect(() => {
    const {
      match: {
        params: { id },
      },
    } = props;

    setUserId(id);

    axios
      .get('/api/users/getUserByID', { params: { userId: id } })
      .then(res => setUserData({name: res.data.name, photo: res.data.photo}));

    axios
      .get('/api/users/getUserProducts', { params: { userId: id } })
      .then(res =>
        res.data.length?
        axios
          .get('/api/products/getAllProductsWithId', { params: { productsIds: res.data } })
          .then(res => setUserProducts(res.data)) :
        setUserProducts([])
      )
  }, [props.match.params])


  useEffect(() => {
    const currProductsArray = userProducts.filter((product, i) => productPaginating().includes(i));
    setCurrentProducts(currProductsArray);
  }, [userProducts, currentPage])

  return (
    <div className='user-profile-page'>
      {!isEmpty(userData) &&
      <>
        <div className='user-avatar'>
          <img src={userData.photo} />
        </div>
        <p style={{fontWeight: 'bold', fontSize: '20px'}}>
          {userData.name}
        </p>
        <UserProfileBlocks
          blocks={[
            {number: '92%', title: 'Positive feedback'}, 
            {number: userProducts.length, title: 'Sales'}, 
            {number: userProducts.length, title: 'Active listings'}
          ]}
        />
        <ProductsList productsArray={currentProducts}/>
      </>}
      {userProducts.length > productsPerPage && !isEmpty(userData) &&
      <PagePagination 
        pageCount={userProducts.length/productsPerPage}
        currentPage={currentPage}
        component={`/users/${userId}`}
      />}
    </div>
  )
}

export default UserProfilePage;