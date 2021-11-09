import React, { Component } from 'react';
import { Route, withRouter } from 'react-router';

class RouteWithLayout extends Component
{
	render ()
	{
		const { layout, component, ...rest } = this.props;
		return (
			<Route {...rest} render={(props) =>
				React.createElement(layout, props, React.createElement(component, props))
			}/>
		);
	}
}

export default withRouter(RouteWithLayout);
