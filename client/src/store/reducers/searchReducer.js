import { SET_FOUND_PRODUCTS } from '../actions/actions';

const initialState = {
  products: []
};

const searchReducer = ( state = initialState, action ) => {
    switch ( action.type ) {
      case SET_FOUND_PRODUCTS:
        return{
          ...state,
          products: action.payload
        };
      default:
        return state;
    }
};

export default searchReducer;