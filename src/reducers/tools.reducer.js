const toolsReducer = (state = { punctuationCorrections: [], autoFixCorrections: [], corrections: [] }, action) => {
  switch (action.type) {
    case 'punctuationCorrectionsChanged':
      return {
        ...state,
        punctuationCorrections: action.payload,
      };
    case 'autoFixCorrectionsChanged':
      return {
        ...state,
        autoFixCorrections: action.payload,
      };
    case 'correctionsChanged':
      return {
        ...state,
        corrections: action.payload,
      };
    default:
      return state;
  }
};

export default toolsReducer;
