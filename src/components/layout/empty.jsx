import { Component } from 'react';

export default class Empty extends Component
{
	render ()
	{
		const { children } = this.props;
		return children;
	}
}
