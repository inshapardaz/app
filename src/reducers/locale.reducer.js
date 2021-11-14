const localeReducer = (state = { language: 'en', isRtl: false }, action) => {
  switch (action.type) {
    case 'languageChanged':
      return {
        ...state,
        language: action.payload.language,
        isRtl: action.payload.isRtl,
      };
    default:
      return state;
  }
};

export default localeReducer;
