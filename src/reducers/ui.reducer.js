import { SET_DARK_MODE } from '@/actions/ui.actions';

const defaultState = {
  darkMode: localStorage.getItem('darkMode') === 'true' || false,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_DARK_MODE:
      return {
        ...state,
        darkMode: action.payload,
      };
    default:
      return state;
  }
};
