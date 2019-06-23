import React                            from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { getEntry } from '../../state/actions/apiActions';

import Routes from '../Routes';
import Header from '../header/header.jsx';
import Home from '../home/home.jsx';
import AuthenticationService from '../../services/AuthenticationService';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class Page extends React.Component
{
	state = {
		isLoading : false
	  };

	async componentDidMount ()
	{
		if (localStorage.getItem('isLoggedIn') === 'true')
		{
		  AuthenticationService.renewSession();
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
		const { isLoading } = this.state;
		if (isLoading)
		{
			return null;
		}

		return (
			<>
				<Routes>
					<Header />
				</Routes>
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
	  getEntry,
	  push
	}, dispatch)
)(Page));

