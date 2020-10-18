import React from 'react';
import { Switch } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';

//import { ConnectedRouter } from 'connected-react-router';

import { history } from '../state';
import RouteWithLayout from './layout/RouteWithLayout';

import Home from './home/home.jsx';
import Layout from './layout/layout.jsx';
import LayoutBoxed from './layout/layoutBoxed.jsx';
import EmptyLayout from './layout/empty.jsx';

import BooksPage from './books/booksPage.jsx';
import AuthorsPage from './authors/authorsPage.jsx';
import SeriesPage from './series/seriesPage.jsx';
import CategoriesPage from './categories/categoriesPage.jsx';
import Callback from './Callback.jsx';

class Routes extends React.Component
{
	render ()
	{
		return (
			<Router history={history}>
				<Switch>
					<RouteWithLayout layout={EmptyLayout} path="/callback" component={Callback} exact />
					<RouteWithLayout layout={Layout} path="/" component={Home} exact/>
					<RouteWithLayout layout={Layout} path="/authors" component={AuthorsPage} />
					<RouteWithLayout layout={LayoutBoxed} path="/books" component={BooksPage} />
					<RouteWithLayout layout={LayoutBoxed} exact path="/series" component={SeriesPage} />
					<RouteWithLayout layout={LayoutBoxed} exact path="/categories" component={CategoriesPage} />
				</Switch>
			</Router>
		);
	}
}

export default Routes;
