import '@babel/polyfill';
import 'webcomponents.js/webcomponents-lite';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import triggerEvent from './utilities/triggerEvent';
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
			clientId={config.clientId}
			audience={config.audience}
			redirectUri={window.location.origin}
			onRedirectCallback={onRedirectCallback}>
			<App apiUrl={config.apiUrl} config={config}/>
		</Auth0Provider>,
		document.getElementById('root')
	);
}

triggerEvent(window, 'appreadytostart');
