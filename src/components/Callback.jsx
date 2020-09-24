import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import Loading from './Loading.jsx';
import AuthService from '../services/AuthService';

const CallbackPage = () =>
{
	useEffect(() =>
	{
		AuthService.handleAuthentication();
	}, []);

	return (<Loading />);
};

export default connect(
	null,
	dispatch => bindActionCreators({
		push
	}, dispatch)
)(CallbackPage);
