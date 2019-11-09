import '@babel/polyfill';
import 'webcomponents.js/webcomponents-lite';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import React from 'react';
import ReactDOM from 'react-dom';
import triggerEvent from './utilities/triggerEvent';
import { Auth0Provider } from './react-auth0-spa';
import App from './App.jsx';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

const onRedirectCallback = appState =>
{
	window.history.replaceState(
		{},
		document.title,
		appState && appState.targetUrl
			? appState.targetUrl
			: window.location.pathname
	);
};

ReactDOM.render(
	<Auth0Provider
	  domain="inshapardaz.eu.auth0.com"
	  client_id="WkEHQXUHgcec5GhzLqUZ0PTVYJ4u9ihI"
	  redirect_uri={window.location.origin}
	  onRedirectCallback={onRedirectCallback}>
		<App />
	</Auth0Provider>,
	document.getElementById('root')
);

triggerEvent(window, 'appreadytostart');
