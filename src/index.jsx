import '@babel/polyfill';
import 'webcomponents.js/webcomponents-lite';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import triggerEvent from './utilities/triggerEvent';
import App from './App.jsx';
import { createStore } from './state';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export async function start ()
{
	const store = await createStore();

	ReactDOM.render(
		<Provider store={store}>
			<App />
		</Provider>,
		document.getElementById('root')
	);
}

triggerEvent(window, 'appreadytostart');
