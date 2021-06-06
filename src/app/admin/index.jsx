import { Container, Grid } from '@material-ui/core';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Overview } from './overview';
import { Users } from './users';
import { Libraries } from './libraries';
import AdminSidebar from '../../components/admin/adminSideBar';

function Admin({ match }) {
	const { path } = match;

	return (
		<Grid container alignItems="stretch">
			<Grid sm={2} item >
				<AdminSidebar />
			</Grid>
			<Grid sm={10} item>
				<Switch>
					<Route exact path='/admin' component={Overview} />
					<Route path='/admin/users' component={Users} />
					<Route path='/admin/libraries' component={Libraries} />
				</Switch>
			</Grid>
		</Grid>
	);
}

export { Admin };
