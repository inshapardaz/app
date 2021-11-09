import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import accountReducer from './account.reducer';
import localeReducer from './locale.reducer';
import notificationReducer from './notification.reducer';
import uiReducer from './ui.reducer';
import libraryReducer from './library.reducer';

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  accountReducer,
  localeReducer,
  notificationReducer,
  uiReducer,
  libraryReducer,
});

export default createRootReducer;
