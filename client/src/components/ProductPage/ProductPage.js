import React, { useState, useEffect } from 'react';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import NavigateNext from '@material-ui/icons/NavigateNext';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import ChatWithSellerModal from '../ChatWithSellerModal/ChatWithSellerModal';
import RoomIcon from '@material-ui/icons/Room';
import { useSelector, useDispatch } from 'react-redux';
import { setFavorites } from '../../store/actions/actions';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import './ProductPage.scss';

const ProductPage = props => {
  const [product, setProduct] = useState({});
  const [seller, setSeller] = useState({});
  const [userId, setUserId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [photoNumber, setPhotoNumber] = useState(0);

  const dispatch = useDispatch();
  const favoritesArray = useSelector(state => state.favorites.favorites);
  const currentUserId = useSelector(state => state.auth.user.id);

  useEffect(() => {
    const {
      match: {
        params: { id },
      },
    } = props;
    axios
      .get('/api/products/getProductById', {params: { id }})
      .then(res => {
        const product = res.data;
        setProduct(product);
        setUserId(product.userId);
        axios
          .get('/api/users/getUserByID', {params: { userId: product.userId }})
          .then(res => setSeller(res.data));
      });
    
  }, [props.match.params.id])

  const changeFavorites = () => {
    if(favoritesArray.includes(product._id)){
      const newArr = favoritesArray.filter(id => id !== product._id);
      dispatch(setFavorites(newArr));
    }
    else
      dispatch(setFavorites([...favoritesArray, product._id]));
  }

  const changePhoto = type => {
    type === 'prev' && photoNumber - 1 >= 0 &&
      setPhotoNumber(photoNumber - 1)
    type === 'next' && photoNumber + 1 < product.photos.length &&
      setPhotoNumber(photoNumber + 1)
  }


  return (
    <>
      {product.photos && seller.photo?
      <div className='product-page'>
        <div className='product-full-info'>
          <div className='product-img'>
            <NavigateBefore 
              className='prev-button'
              onClick={() => changePhoto('prev')}>
            </NavigateBefore>
            <img src={product.photos[photoNumber]} />
            <NavigateNext 
              className='next-button'
              onClick={() => changePhoto('next')}
            >
            </NavigateNext>
          </div>
          <div className='product-info'>
            <p style={{fontSize: '18px'}}>{product.title}</p>
            <p style={{fontSize: '14px', color: 'rgba(123, 123, 123, 0.776523)'}}><RoomIcon />{product.location}</p>
            <div className='line'/>
            <p style={{fontSize: '14px'}}>{product.description}</p>
            <div className='price-div'>
              <p style={{fontSize: '19px', color:' #101010'}}>{product.price}</p>
            </div>
          </div>
        </div>
        <div className='other-info'>
          <div className='seller-info'>
            <div 
              className='round' 
              style={{ cursor: 'pointer'}}
              onClick={() => props.history.push(`/users/${userId}/1`)}
            >
              <img src={seller.photo}/>
            </div>
            <p>{seller.name}</p>
          </div>
          <button 
            className='chat-button'
            disabled={currentUserId===userId}
            onClick={() => setShowModal(true)}
          >
              Chat with seller
          </button>
          <ChatWithSellerModal
            showModal={showModal}
            setShowModal={setShowModal}
            product={product}
            seller={seller}
            currentUserId={currentUserId}
            sellerId={userId}
            socket={props.socket}
          />
          {favoritesArray.includes(product._id)?
          <button 
            className='favorite-button'
            onClick={changeFavorites}
          >
            <FavoriteBorderIcon style={{verticalAlign: 'middle', paddingRight: '10px'}}/>
            Remove from favorite
          </button> :
          <button 
            className='favorite-button'
            onClick={changeFavorites}
          >
            <FavoriteBorderIcon style={{verticalAlign: 'middle', paddingRight: '10px'}}/>
            Add to favorite
          </button>}
        </div>
      </div> :
      <p>Product is loading...</p>}
    </>
  )
}

export default withRouter(ProductPage);