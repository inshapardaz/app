import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Typography, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { accountService } from '../../services';
import { FormattedMessage } from 'react-intl';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		marginBottom: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	}
}));

function Details({ match }) {
	const { path } = match;
	const classes = useStyles();
	const user = accountService.userValue;

	return (
		<div className={classes.paper}>
			<Container component="main" maxWidth="md">
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<Typography variant="h6"><FormattedMessage id="profile.name.title" /></Typography>
					</Grid>
					<Grid item xs={12} >
						{user.title} {user.firstName} {user.lastName}
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6" ><FormattedMessage id="profile.email.title" /></Typography>
					</Grid>
					<Grid item xs={12}>
						{user.email}
					</Grid>
					<Grid item xs={12}>
						<Button component={Link} fullWidth variant="contained" color="primary" to={`${path}/update`}><FormattedMessage id="profile.edit" /></Button>
					</Grid>
				</Grid>
			</Container>
		</div>
	);
}

export { Details };
