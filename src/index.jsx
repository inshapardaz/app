import React from 'react';
import { Router } from 'react-router-dom';
import { render } from 'react-dom';

import { history } from './helpers';
import { accountService } from './services';
import { App } from './app';


accountService.refreshToken().finally(startApp);

function startApp() {
	render(
		<Router history={history}>
			<App />
		</Router>,
		document.getElementById('app')
	);
}
