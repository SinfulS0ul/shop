import { GET_ALL_PRODUCTS } from '../actions/actions';

const initialState = {
  products: []
};

const modalReducer = ( state = initialState, action ) => {
    switch ( action.type ) {
      case GET_ALL_PRODUCTS:
        return{
          ...state,
          products: action.payload
        };
      default:
        return state;
    }
};

export default modalReducer;