import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { push } from 'connected-react-router';
import { handleAuthentication } from '../state/actions/authActions';

class Callback extends React.Component
{
	componentWillMount ()
	{
		console.log('authentication callback.');
		this.props.handleAuthentication();
		console.log('authenticated. redirecting to home page...');
		this.props.push('/');
	}

	render ()
	{
		return (
			<div>Authenticating</div>
		);
	}
}

Callback.propTypes = {
	history : PropTypes.object.isRequired
};

export default connect(
	null,
	dispatch => bindActionCreators({
		push,
		handleAuthentication
	}, dispatch)
)(Callback);
