import React                            from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from '../home/home.jsx';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default function Page ()
{
	return (
		<BrowserRouter>
			<Switch>
				<Route path="/" component={
					Home
				} exact />
			</Switch>
		</BrowserRouter>
	);
}
