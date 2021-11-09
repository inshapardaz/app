import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';

import createRootReducer from '@/reducers';
import browserHistory from './browserHistory';

export default function configureStore(preloadedState) {
  const store = createStore(
    createRootReducer(browserHistory),
    preloadedState,
    compose(
      applyMiddleware(routerMiddleware(browserHistory), thunk),
    ),
  );

  return store;
}
