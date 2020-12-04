import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { List } from './list';
import { AddEdit } from './addEdit';

function Libraries({ match }) {
	const { path } = match;

	return (
		<Switch>
			<Route exact path={path} component={List} />
			<Route path={`${path}/add`} component={AddEdit} />
			<Route path={`${path}/edit/:id`} component={AddEdit} />
		</Switch>
	);
}

export { Libraries };
