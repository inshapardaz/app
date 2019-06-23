import auth0 from 'auth0-js';
import { history } from '../state';

const isLoggedIn = 'isLoggedIn';
const accessToken = 'accessToken';
const idToken = 'idToken';
const expiresAt = 'expiresAt';

export default class AuthenticationService
{
	constructor ({
		clientId,
		audience,
		authDomain
	})
	{
		this.auth0 = new auth0.WebAuth({
			domain : authDomain,
			clientID : clientId,
			audience,
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
		  }
		  else if (err)
		  {
				history.replace('/error?type=auth');
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

	  renewSession ()
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
			 console.log(`Could not get a new token (${err.error}: ${err.error_description}).`);
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
	  }

	  isLoggedIn ()
	{
		return (localStorage.getItem(isLoggedIn) === 'true');
	  }

	  isAuthenticated ()
	{
		const expiresAtValue = localStorage.getItem(expiresAt);
		return new Date().getTime() < expiresAtValue;
	  }
}
