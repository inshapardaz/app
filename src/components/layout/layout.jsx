import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { getEntry } from '../../state/actions/apiActions';
import { renewSession } from '../../state/actions/authActions';
import Header from '../header/header.jsx';

class Layout extends Component
{
	state = {
		isLoading : false
	};

	async componentDidMount ()
	{
		if (localStorage.getItem('isLoggedIn') === 'true')
		{
		  this.props.renewSession();
		}

		this.setState({
		  isLoading : true
		});

		try
		{
		  await this.props.getEntry();
		  this.setState({
				isLoading : false
		  });
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
		const { children } = this.props;
		return (
			<>
				<Header />
				{children}
			</>
		);
	}
}

export default (connect(
	(state) => ({
	  history : state.history,
	  entry : state.entry,
	  isLoading : state.isLoading
	}),
	dispatch => bindActionCreators({
		renewSession,
		getEntry,
	  	push
	}, dispatch)
)(Layout));
