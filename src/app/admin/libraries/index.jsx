import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LibraryAdminList from '../../../components/library/libraryAdminList';


function Libraries({ match }) {
	const { path } = match;

	return (
		<Switch>
			<Route exact path={path} component={LibraryAdminList} />
		</Switch>
	);
}

export { Libraries };
