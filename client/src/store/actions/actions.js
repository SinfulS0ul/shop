export const GET_ERRORS = 'GET_ERRORS';
export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const GET_ALL_PRODUCTS = 'GET_ALL_PRODUCTS';
export const SET_MODAL = 'SET_MODAL';
export const SET_FAVORITES = 'SET_FAVORITES';
export const SHOW_FAVORITES = 'SHOW_FAVORITES';
export const SET_FOUND_PRODUCTS = 'SET_PRODUCT_NAME';

export const getAllProducts = products => {
  return {
    type: GET_ALL_PRODUCTS,
    payload: products
  }
}
 
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
}

export const setModal = () => {
  return { type: SET_MODAL }
}

export const setFavorites = favorites => {
  return {
    type: SET_FAVORITES,
    payload: favorites
  }
}

export const setSellProduct = product => {
  return {
    type: SET_FAVORITES,
    payload: product
  }
}

export const showFavorites = () => {
  return { type: SHOW_FAVORITES }
}

export const setFoundProducts = products => {
  return {
    type: SET_FOUND_PRODUCTS,
    payload: products
  }
}