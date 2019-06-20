import * as redux         from 'redux';
import thunk              from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { routerMiddleware, connectRouter } from 'connected-react-router';
import config             from './reducers/config';
import isLoggedIn         from './reducers/isLoggedIn';
import status             from './reducers/status';
import requirements       from './reducers/requirements';
import nextAssessmentDate from './reducers/nextAssessmentDate';
import assessments        from './reducers/assessments';
import hasAssessment      from './reducers/hasAssessment';

export const history = createBrowserHistory();

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export async function createStore (configuration, services)
{
	return redux.createStore(
		redux.combineReducers({
			config,
			isLoggedIn,
			status,
			requirements,
			nextAssessmentDate,
			assessments,
			hasAssessment,
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
