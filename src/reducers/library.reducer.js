import {
  LIBRARY_SELECTED, ENTRY_LOADED, CATEGORIES_LOADED,
} from '@/actions/library.actions';

const defaultState = {
  entry: null,
  entryFetched: false,
  library: null,
};
export default (state = defaultState, action) => {
  switch (action.type) {
    case ENTRY_LOADED:
      return {
        ...state,
        entry: action.payload,
        entryFetched: true,
      };
    case CATEGORIES_LOADED:
      return {
        ...state,
        categories: action.payload,
      };
    case LIBRARY_SELECTED:
      return {
        ...state,
        library: action.payload,
      };
    default:
      return state;
  }
};
