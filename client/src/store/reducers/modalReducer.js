import { SET_MODAL } from '../actions/actions';

const initialState = {
  modal: false
};

const modalReducer = ( state = initialState, action ) => {
    switch ( action.type ) {
      case SET_MODAL:
        return{
          ...state,
          modal: !state.modal
        };
      default:
        return state;
    }
};

export default modalReducer;