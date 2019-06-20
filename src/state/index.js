import * as redux         from 'redux';
import thunk              from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { routerMiddleware, connectRouter } from 'connected-react-router';
import authenticationReducer from './reducers/authenticationReducers';
import apiReducers from './reducers/apiReducers';

export const history = createBrowserHistory();

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export async function createStore (configuration, services)
{
	return redux.createStore(
		redux.combineReducers({
			authenticationReducer,
			apiReducers,
			router : connectRouter(history)
		}),
		{
			config : configuration
		},
		redux.applyMiddleware(
			thunk.withExtraArgument(services),
			routerMiddleware(history)
		)
	);
}
