import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './reducers/authReducer';
import errorReducer from './reducers/errorReducer';
import productsReducer from './reducers/productsReducer';
import modalReducer from './reducers/modalReducer';
import favoritesReducer from './reducers/favoritesReducer';
import showFavoritesReducer from './reducers/showFavoritesReducer';
import searchReducer from './reducers/searchReducer';

const favoritesPersistConfig = {
  key: 'favorites',
  storage: storage,
  whitelist: ['favorites']
}

const modalPersistConfig = {
  key: 'modal',
  storage: storage,
  whitelist: ['modal']
}

const authPersistConfig = {
  key: 'auth',
  storage: storage,
  whitelist: ['auth']
}

export default combineReducers({
  favorites: persistReducer(favoritesPersistConfig, favoritesReducer),
  errors: errorReducer,
  auth: persistReducer(authPersistConfig, authReducer),
  products: productsReducer,
  modal: persistReducer(modalPersistConfig, modalReducer),
  showFavorites: showFavoritesReducer,
  foundProducts: searchReducer
})