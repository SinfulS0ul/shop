import React, { useState, useEffect } from 'react';
import './Header.scss';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter, NavLink } from 'react-router-dom';
import SearchIcon from '@material-ui/icons/Search';
import RoomIcon from '@material-ui/icons/Room';
import SellProductModal from '../SellProductModal/SellProductModal';
import UserDropdown from '../UserDropdown/UserDropdown';
import { useDispatch, useSelector } from 'react-redux';
import { showFavorites, setFoundProducts } from '../../store/actions/actions';
import axios from 'axios';

const useStyles = makeStyles(() => ({
  favoriteBlack: {
    fontSize: 35,
    cursor: 'pointer',
    '&:hover': {
      color: 'rgb(169, 3, 3)',
    },
  },
  favoriteWhite: {
    fontSize: 35,
    cursor: 'pointer',
    color: 'white',
    '&:hover': {
      color: 'rgb(169, 3, 3)',
    },
  }
}));


const Header = props => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [headerColor, setHeaderColor] = useState('#F2F2F2');
  const [searchingName, setSearchingName] = useState('');
  const [searchingLocation, setSearchingLocation] = useState('');
  const [style, setStyle] = useState(0);

  const isAuthentificated = useSelector(state => state.auth.isAuthentificated);

  useEffect(() => {
    const path = props.history.location.pathname;
    if (path.includes('Search') || 
        (path.includes('product') && !path.includes('products/new')) || 
        path.includes('user') || 
        path.includes('Main')){
          setHeaderColor('linear-gradient(180deg, #090810 0%, #171236 100%)')
          setStyle(0)
        }
    else if(path.includes('Inbox') || path.includes('EditProfile')){
      setHeaderColor('linear-gradient(180deg, #090810 0%, #171236 100%)');
      setStyle(1);
    }
    else
      setHeaderColor('#F2F2F2')
  }, [props.history.location.pathname]);

  const handleInputChange = e =>{
    const target = e.target;
    target.name === 'nameInput' ?
      setSearchingName(e.target.value) :
      setSearchingLocation(e.target.value);
  }

  const searchProducts = () => {
    let product = {};
    if(searchingName)
      product.title = searchingName;
    if(searchingLocation)
      product.location =  searchingLocation;

    axios
      .get('/api/products/getSearchedProducts', {params: { ...product }})
        .then(res => dispatch(setFoundProducts(res.data)))
        .then(res => props.history.push('/Search/1'))
  }

  return (
    <div className='header' style={{ background: headerColor }}>
      <div className='constant-header'>
        <NavLink
          to='/Main/1'
          className={headerColor === '#F2F2F2'? 'nav-link__blue' : 'nav-link__white'}
        >
          Shop
        </NavLink>
        <div className='constant-header__right-content'>
          <SellProductModal
            showModal={props.showModal}
            setShowModal={props.setShowModal}
          />
          <button 
            onClick={() => props.setShowModal(true)} 
            className='constant-header__right-content__sell-button'
          >
            SELL
          </button>
          {isAuthentificated ?
          <UserDropdown /> :
          <NavLink
            to='/Login'
            className='nav-link'
            style={{ color: '#111111' }}
          >
            <button className={headerColor === '#F2F2F2'? 'constant-header__right-content__login-button' : 'constant-header__right-content__login-button__blue'}>
              LOGIN
            </button>
          </NavLink>}
          <FavoriteBorderIcon
            onClick={() => {props.history.push('/Main/1'); dispatch(showFavorites())}}
            className={headerColor === '#F2F2F2'? classes.favoriteBlack : classes.favoriteWhite} 
          />
        </div>
      </div>
      {(headerColor !== '#F2F2F2' && style === 0) && 
      <div className='secondary-header'>
        <div className='search-input'>
          <div className='search-input__search-icon'>
            <SearchIcon />
          </div>
          <input
            onChange={handleInputChange}
            name='nameInput'
            placeholder='Search products by name'
          />
        </div>
        <div className='location-input'>
          <div className='location-input__room-icon'>
            <RoomIcon />
          </div>
          <input
            onChange={handleInputChange}
            name='locationInput'
            placeholder='Location'
          />
        </div>
        <button
          onClick={searchProducts}
        >
          SEARCH
        </button>
      </div>}
    </div>
  );
}

export default withRouter(Header);