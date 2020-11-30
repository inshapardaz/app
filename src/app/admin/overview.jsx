import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';

function Overview({ match }) {
	const { path } = match;

	return (
		<Container component="main" maxWidth="s">
			<h1><FormattedMessage id="header.administration" /></h1>
			<p><Button component={Link} to={`${path}/users`} fullWidth ><FormattedMessage id="admin.users.title" /></Button></p>
			<p><Button component={Link} to={`${path}/libraries`} fullWidth ><FormattedMessage id="admin.libraries.title" /></Button></p>
		</Container>
	);
}

export { Overview };
