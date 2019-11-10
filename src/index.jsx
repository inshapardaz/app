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

export async function start (config)
{
	ReactDOM.render(
		<Auth0Provider
			domain={config.authDomain}
			client_id={config.clientId}
			redirect_uri={window.location.origin}
			onRedirectCallback={onRedirectCallback}>
			<App apiUrl={config.apiUrl}/>
		</Auth0Provider>,
		document.getElementById('root')
	);
}

triggerEvent(window, 'appreadytostart');
