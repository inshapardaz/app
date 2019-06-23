import * as redux         from 'redux';
import thunk              from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { routerMiddleware, connectRouter } from 'connected-react-router';
import { reducer as oidcReducer } from 'redux-oidc';
import authenticationReducer from './reducers/authenticationReducers';
import apiReducers from './reducers/apiReducers';

export const history = createBrowserHistory();

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export async function createStore (services)
{
	// eslint-disable-next-line no-underscore-dangle
	const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || redux.compose;

	return redux.createStore(
		redux.combineReducers({
			oidc : oidcReducer,
			authenticationReducer,
			apiReducers,
			router : connectRouter(history)
		}),
		composeEnhancers(
			redux.applyMiddleware(
				thunk.withExtraArgument(services), routerMiddleware(history)
			)
		)
	);
}
