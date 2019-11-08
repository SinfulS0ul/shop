import { SHOW_FAVORITES } from '../actions/actions';

const initialState = {
  showFavorites: false
};

const showFavoritesReducer = ( state = initialState, action ) => {
    switch ( action.type ) {
      case SHOW_FAVORITES:
        return{
          ...state,
          showFavorites: !state.showFavorites
        };
      default:
        return state;
    }
};

export default showFavoritesReducer;