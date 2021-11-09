export const SET_DARK_MODE = 'SET_DARK_MODE';

export default {
  initaliseUI: () => (dispatch) => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    dispatch({
      type: SET_DARK_MODE,
      payload: darkMode,
    });
  },

  setDarkMode: (darkMode) => (dispatch) => {
    localStorage.setItem('darkMode', darkMode);
    dispatch({
      type: SET_DARK_MODE,
      payload: darkMode,
    });
  },
};
