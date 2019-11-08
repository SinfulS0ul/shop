import React from 'react';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { setFavorites } from '../../store/actions/actions';
import { withRouter } from 'react-router-dom';
import './Product.scss';

const useStyles = makeStyles(() => ({
  favoriteIcon: {
    fontSize: 24,
    verticalAlign: 'middle',
    color: 'green',
    cursor: 'pointer',
    '&:hover': {
      color: 'rgb(169, 3, 3)',
    },
  },
  favoriteIconActive: {
    fontSize: 24,
    verticalAlign: 'middle',
    color: 'rgb(169, 3, 3)',
    cursor: 'pointer'
  }
}));


const Product = props => {
  const dispatch = useDispatch();
  const favoritesArray = useSelector(state => state.favorites.favorites);
  const { product } = props;

  const changeFavorites = () => {
    if(favoritesArray.includes(product._id)){
      const newArr = favoritesArray.filter(id => id !== product._id);
      dispatch(setFavorites(newArr));
    }
    else
      dispatch(setFavorites([...favoritesArray, product._id]));
  }

  const openProductPage = () => {
    props.history.push(`/products/${product._id}`)
  }

  const classes = useStyles();

  return (
    <div className='product'>
      <img 
        className='product__photo'
        src={product.photos[0]}
        onClick={openProductPage}
      />
      <div className='product__info'>
        <div className='title'>{product.title}</div>
        <div className='price'>{product.price}</div>
        <div className='round'>
          {
            favoritesArray.includes(product._id)?
              <FavoriteIcon 
                className={classes.favoriteIconActive} 
                onClick={changeFavorites}
              />:
              <FavoriteBorderIcon 
                className={classes.favoriteIcon} 
                onClick={changeFavorites}
              />
          }
        </div>
      </div>
    </div>
  )
}

export default withRouter(Product);