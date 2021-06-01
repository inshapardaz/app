import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import { useSnackbar } from 'notistack';
import { useIntl, FormattedMessage } from 'react-intl';
import { makeStyles } from '@material-ui/core/styles';
import { accountService } from '../../services';
import Footer, { Copyright } from '../../components/footer';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { CssBaseline, Grid, Paper } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	root: {
		height: '100vh',
	},
	image: {
		backgroundImage: 'url(https://source.unsplash.com/random)',
		backgroundRepeat: 'no-repeat',
		backgroundColor:
			theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
		backgroundSize: 'cover',
		backgroundPosition: 'center',
	},
	paper: {
		margin: theme.spacing(8, 4),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	message: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(3),
	}
}));


function VerifyEmail({ history }) {
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();
	const EmailStatus = {
		Verifying: 'Verifying',
		Failed: 'Failed'
	}

	const [emailStatus, setEmailStatus] = useState(EmailStatus.Verifying);

	useEffect(() => {
		const { token } = queryString.parse(location.search);

		// remove token from url to prevent http referer leakage
		history.replace(location.pathname);

		accountService.verifyEmail(token)
			.then(() => {
				enqueueSnackbar(intl.formatMessage({ id: 'verify.message.success' }), { variant: 'success' })
				history.push('login');
			})
			.catch(() => {
				setEmailStatus(EmailStatus.Failed);
			});
	}, []);

	function getBody() {
		switch (emailStatus) {
			case EmailStatus.Verifying:
				return <FormattedMessage id="verify.message.verifying" />;
			case EmailStatus.Failed:
				return <FormattedMessage id="verify.message.failure" values={{
					link: <a href="/account/forgot-password">
						<FormattedMessage id="login.password.title" />
					</a>
				}} />;
		}
	}

	return (
		<Grid container component="main" className={classes.root}>
			<CssBaseline />
			<Grid item xs={false} sm={4} md={7} className={classes.image} />
			<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						<FormattedMessage id="verify.title" />
					</Typography>

					<Box mt={5}>
						<Typography component="h3" variant="h6">
							{getBody()}
						</Typography>
					</Box>
					<Box mt={5}>
						<Copyright />
					</Box>
				</div>
			</Grid>
		</Grid >);
}

export default VerifyEmail;
