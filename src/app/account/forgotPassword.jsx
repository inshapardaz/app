import React from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { useSnackbar } from 'notistack';
import { accountService } from '../../services';
import { TextField } from 'formik-material-ui';
import { useIntl, FormattedMessage } from 'react-intl';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Paper } from '@material-ui/core';
import { Copyright } from '../../components/footer';

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
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
	buttonProgress: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -12,
		marginLeft: -12,
	},
}));

function ForgotPassword() {
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();
	const initialValues = {
		email: ''
	};

	const validationSchema = Yup.object().shape({
		email: Yup.string()
			.email(intl.formatMessage({ id: 'forgotPassword.message.email.error' }))
			.required(intl.formatMessage({ id: 'forgotPassword.message.email.required' }))
	});

	function onSubmit({ email }, { setSubmitting }) {
		accountService.forgotPassword(email)
			.then(() => enqueueSnackbar(intl.formatMessage({ id: 'forgotPassword.message.success' }), { variant: 'success' }))
			.catch(error => enqueueSnackbar(intl.formatMessage({ id: 'forgotPassword.message.error' }), { variant: 'error' }))
			.finally(() => setSubmitting(false));
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
						<FormattedMessage id="forgot.password" />
					</Typography>
					<Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
						{({ errors, touched, isSubmitting }) => (
							<Form>
								<Field component={TextField} name="email" type="email" variant="outlined" margin="normal" fullWidth
									label={<FormattedMessage id="login.email.title" />} error={errors.email && touched.email} />
								<Button
									type="submit"
									fullWidth
									variant="contained"
									color="primary"
									className={classes.submit}
									disabled={isSubmitting}
								>
									<FormattedMessage id="forgotPassword.submit" />
								</Button>
								{isSubmitting && <CircularProgress size={24} className={classes.buttonProgress} />}


								<Grid container>
									<Grid item xs>
										<Link href="account/register" variant="body2">
											<FormattedMessage id="register" />
										</Link>
									</Grid>
									<Grid item>
										<Link href="/account/login" variant="body2">
											<FormattedMessage id="login" />
										</Link>
									</Grid>
								</Grid>
								<Box mt={5}>
									<Copyright />
								</Box>
							</Form>
						)}
					</Formik>
				</div>
			</Grid>
		</Grid>
	)
}

export default ForgotPassword;
