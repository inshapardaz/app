import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';

import { getEntry } from './state/actions/apiActions';

class Loading extends React.Component
{
	state = {
		isLoading : true
	};

	async componentDidMount ()
	{
		try
		{
			await this.props.getEntry();
		}
		catch (e)
		{
			console.error('error', e);
			this.props.push('/error');
		}

		this.setState({
			isLoading : false
		});
	}

	render ()
	{
		if (this.state.isLoading)
		{
			return <h1>Loading...</h1>;
		}

		return this.props.children;
	}
}

export default (connect(
	(state) => ({
		entry : state.apiReducers.entry
	}),
	dispatch => bindActionCreators({
	  getEntry,
	  push
	}, dispatch)
)(Loading));
