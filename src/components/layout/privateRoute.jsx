import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { accountService } from '../../services';

function PrivateRoute({ layout, component, adminOnly, ...rest }) {
	return (
		<Route {...rest} render={props => {
			const user = accountService.userValue;
			if (!user) {
				// not logged in so redirect to login page with the return url
				return <Redirect to={{ pathname: '/account/login', state: { from: props.location } }} />
			}

			if (adminOnly && !user.isSuperAdmin) {
				// role not authorized so redirect to home page
				return <Redirect to={{ pathname: '/' }} />
			}

			// authorized so return component
			return React.createElement(layout, props, React.createElement(component, props));
		}} />
	);
}

export { PrivateRoute };
