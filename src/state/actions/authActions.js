import { LOGIN, LOGOUT, CHANGEPASSWORD } from './actionTypes';
import AuthenticationService from '../../services/AuthenticationService';

export function login ()
{
	AuthenticationService.login();
	return {
		type : LOGIN
	};
}

export function logout ()
{
	AuthenticationService.logout();
	window.location.replace('/');
	return {
		type : LOGOUT
	};
}

export function changePassword ()
{
	AuthenticationService.changePassword();
	window.location.replace('/');
	return {
		type : CHANGEPASSWORD
	};
}
