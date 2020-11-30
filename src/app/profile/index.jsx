import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Details } from './details';
import { Update } from './update';

function Profile({ match }) {
	const { path } = match;

	return (

		<Switch>
			<Route exact path={path} component={Details} />
			<Route path={`${path}/update`} component={Update} />
		</Switch>
	);
}

export { Profile };
