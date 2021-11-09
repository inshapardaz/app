import {
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT,
} from '@/actions/account.actions';

const initialState = {
  init: false,
  user: null,
  isLoggingIn: false,
};

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        isLoggingIn: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggingIn: false,
        user: action.payload,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isLoggingIn: false,
        user: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        user: action.payload,
      };
    case 'authInit':
      return {
        ...state,
        init: true,
        user: action.payload,
      };
    default:
      return state;
  }
};

export default accountReducer;
