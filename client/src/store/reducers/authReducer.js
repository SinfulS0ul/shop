import { SET_CURRENT_USER } from '../actions/actions';
import isEmpty from '../../constants/isEmpty';

const initialState = {
  isAuthentificated: false,
  user: {}
};

const authReducer = ( state = initialState, action ) => {
    switch ( action.type ) {
      case SET_CURRENT_USER:
        return{
          ...state,
          isAuthentificated: !isEmpty(action.payload),
          user: action.payload
        };
      default:
        return state;
    }
};

export default authReducer;