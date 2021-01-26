import React from 'react';
import { Redirect, Switch } from 'react-router';
import { Route, useLocation } from 'react-router-dom';

import RouteWithLayout from './layout/routeWithLayout';
import { PrivateRoute } from './layout/privateRoute';
import { Role } from '../helpers';
import { emptyLayout, fullWidthLayout, boxedLayout } from './layout';
import { Profile } from '../app/profile';
import { Admin } from '../app/admin';
import Register from '../app/account/register';
import Login from '../app/account/login';
import ForgotPassword from '../app/account/forgotPassword';
import VerifyEmail from '../app/account/verifyEmail';
import ResetPassword from '../app/account/resetPassword';

import Home from '../app/home';
import BookPageEditor from '../app/books/bookEditorPage';
import BooksPage from '../app/books/booksPage.jsx';
import AuthorsPage from '../app/authors/authorsPage.jsx';
import AuthorPage from '../app/authors/authorPage.jsx';
import SeriesPage from '../app/series/seriesPage.jsx';
import CategoriesPage from '../app/categories/categoriesPage.jsx';

const Routes = () => {
	const { pathname } = useLocation();
	return (
		<Switch>
			<RouteWithLayout layout={fullWidthLayout} path="/" component={Home} exact />
			<RouteWithLayout layout={fullWidthLayout} path="/authors/:id" component={AuthorPage} exact />
			<RouteWithLayout layout={fullWidthLayout} path="/authors" component={AuthorsPage} />
			<RouteWithLayout layout={fullWidthLayout} path="/books/:id/editor" component={BookPageEditor} exact />
			<RouteWithLayout layout={fullWidthLayout} path="/books" component={BooksPage} />
			<RouteWithLayout layout={fullWidthLayout} exact path="/series" component={SeriesPage} />
			<RouteWithLayout layout={fullWidthLayout} exact path="/categories" component={CategoriesPage} />
			<PrivateRoute layout={fullWidthLayout} path="/profile" component={Profile} />
			<PrivateRoute layout={fullWidthLayout} path="/admin" roles={[Role.Admin]} component={Admin} />
			<Route path="/account/login" component={Login} layout={emptyLayout} />
			<Route path="/account/register" component={Register} />
			<Route path="/account/verify-email" component={VerifyEmail} />
			<Route path="/account/forgot-password" component={ForgotPassword} />
			<Route path="/account/reset-password" component={ResetPassword} />
			<Redirect from="/:url*(/+)" to={pathname.slice(0, -1)} />
			<Route exact path="/" component={Home} />
			{/* <Redirect from="*" to="/" /> */}
		</Switch>
	);
};

export default Routes;
