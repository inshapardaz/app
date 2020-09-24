import auth0 from 'auth0-js';
import { history } from '../state';

const isLoggedIn = 'isLoggedIn';
const accessToken = 'accessToken';
const idToken = 'idToken';
const expiresAt = 'expiresAt';
const Config = require('Config');

class AuthService
{
	userProfile;

	constructor ()
	{
		this.auth0 = new auth0.WebAuth({
			domain : Config.authDomain,
			clientID : Config.clientId,
			audience : Config.audience,
			redirectUri : `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/callback`,
			responseType : 'token id_token',
			scope : 'openid profile'
		});

		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
		this.handleAuthentication = this.handleAuthentication.bind(this);
		this.isAuthenticated = this.isAuthenticated.bind(this);
		this.getAccessToken = this.getAccessToken.bind(this);
		this.getIdToken = this.getIdToken.bind(this);
		this.renewSession = this.renewSession.bind(this);

		this.getProfile = this.getProfile.bind(this);
	}

	login ()
	{
		this.auth0.authorize();
	}

	changePassword ()
	{
		this.getProfile((p) =>
		{
			this.auth0.changePassword({ email : p.email });
		});
	}

	register ()
	{
		this.auth0.signup();
	}

	handleAuthentication ()
	{
		this.auth0.parseHash((err, authResult) =>
		{
			if (authResult && authResult.accessToken && authResult.idToken)
			{
				this.setSession(authResult);
				console.log('Going to /');
				location.replace('/');
			}
			else if (err)
			{
				location.replace('/error?type=auth');
				console.log(err);
			}
		});
	}

	getAccessToken ()
	{
		return localStorage.getItem(accessToken);
	}

	getIdToken ()
	{
		return localStorage.getItem(idToken);
	}

	setSession (authResult)
	{
		localStorage.setItem(isLoggedIn, 'true');

		let expiry = (authResult.expiresIn * 1000) + new Date().getTime();

		localStorage.setItem(accessToken, authResult.accessToken);
		localStorage.setItem(idToken, authResult.idToken);
		localStorage.setItem(expiresAt, expiry);
	}

	renewSession (callback)
	{
		this.auth0.checkSession({}, (err, authResult) =>
		{
			if (authResult && authResult.accessToken && authResult.idToken)
			{
				this.setSession(authResult);
			}
			else if (err)
			{
				this.logout();
				console.log(err);
				alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
			}
		});
	}

	getProfile (cb)
	{
		this.auth0.client.userInfo(this.getAccessToken(), (err, profile) =>
		{
			if (profile)
			{
				this.userProfile = profile;
			}
			cb(err, profile);
		});
	}

	logout ()
	{
		localStorage.removeItem(isLoggedIn);
		localStorage.removeItem(accessToken);
		localStorage.removeItem(idToken);
		localStorage.removeItem(expiresAt);

		this.userProfile = null;
		history.replace('/');
		location.reload();
	}

	isLoggedIn ()
	{
		return (localStorage.getItem(isLoggedIn) === 'true');
	}

	isAuthenticated ()
	{
		let expiresAtValue = localStorage.getItem(expiresAt);
		if (expiresAtValue)
		{
			return new Date().getTime() < expiresAtValue;
		}

		return false;
	}
}

export default new AuthService();
