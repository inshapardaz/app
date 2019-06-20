import React from 'react';
import { Switch, Route } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';

import { history } from '../state';

import Home from './home/home.jsx';
import Callback from './callback';

class Routes extends React.Component
{

	render ()
	{
		return (
			<ConnectedRouter history={history}>
				<Switch>
					<Route path="/callback" component={Callback} exact />
					<Route path="/" component={Home} exact />
				</Switch>
			</ConnectedRouter>
		);
	}
}

export default Routes;
