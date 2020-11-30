import { Container } from '@material-ui/core';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Overview } from './overview';
import { Users } from './users';
import { Libraries } from './libraries';

function Admin({ match }) {
	const { path } = match;

	return (
		<div className="p-4">
			<Container component="main">
				<Switch>
					<Route exact path={path} component={Overview} />
					<Route path={`${path}/users`} component={Users} />
					<Route path={`${path}/libraries`} component={Libraries} />
				</Switch>
			</Container>
		</div>
	);
}

export { Admin };
