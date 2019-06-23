import { LOGIN, LOGOUT, CHANGE_PASSWORD, PROFILE, AUTHENTICATE } from './actionTypes';
import AuthenticationService from '../../services/AuthenticationService';

export function login ()
{
	return async (dispatch, getState, { authenticationService }) =>
	{
		await authenticationService.login();
		dispatch({
			type : LOGIN
		});
	};
}

export function logout ()
{
	return async (dispatch, getState, { authenticationService }) =>
	{
		await authenticationService.logout();
		window.location.replace('/');
		dispatch({
			type : LOGOUT
		});
	};
}

export function changePassword ()
{
	AuthenticationService.changePassword();
	window.location.replace('/');
	return {
		type : CHANGE_PASSWORD
	};
}

export function getProfile ()
{
	return async (dispatch, getState, { authenticationService }) =>
	{
		if (authenticationService.isLoggedIn())
		{
			authenticationService.getProfile((err, profile) =>
			{
				if (err)
				{
					console.log(err.stack);
				}

				dispatch({
					type : PROFILE,
					payload : profile
				});
			});
		}
	};
}

export function handleAuthentication ()
{
	return (dispatch, getState, { authenticationService }) =>
	{
		authenticationService.handleAuthentication();

		dispatch({ type : AUTHENTICATE });
	};
}

export function renewSession ()
{
	return (dispatch, getState, { authenticationService }) =>
	{
		authenticationService.renewSession();

		dispatch({ type : 'renew_session' });
	};
}
