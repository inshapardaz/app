import React from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import { Typography, Link, Avatar, FormControl } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Select } from 'formik-material-ui';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { useSnackbar } from 'notistack';
import { accountService } from '../../services';
import { TextField, CheckboxWithLabel } from 'formik-material-ui';
import { useIntl, FormattedMessage } from 'react-intl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { Copyright } from '../../components/footer';
import { Paper } from '@material-ui/core';

import BootstrapInput from '../../components/bootstrapInput';


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


function Register({ history }) {
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();
	const initialValues = {
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		acceptTerms: false
	};

	const validationSchema = Yup.object().shape({
		name: Yup.string()
			.required(intl.formatMessage({ id: 'register.message.name.required' })),
		email: Yup.string()
			.email(intl.formatMessage({ id: 'register.message.email.error' }))
			.required(intl.formatMessage({ id: 'register.message.email.required' })),
		password: Yup.string()
			.min(6, intl.formatMessage({ id: 'register.message.password.error.length' }))
			.required(intl.formatMessage({ id: 'register.message.password.required' })),
		confirmPassword: Yup.string()
			.oneOf([Yup.ref('password'), null], intl.formatMessage({ id: 'register.message.confirmPassword.error.match' }))
			.required(intl.formatMessage({ id: 'register.message.confirmPassword.required' })),
		acceptTerms: Yup.bool()
			.oneOf([true], intl.formatMessage({ id: 'register.message.acceptTerms.requires' }))
	});

	function onSubmit(fields, { setStatus, setSubmitting }) {
		setStatus();
		accountService.register(fields)
			.then(() => {
				enqueueSnackbar(intl.formatMessage({ id: 'register.message.success' }), { variant: 'success' })
				history.push('login');
			})
			.catch(error => {
				setSubmitting(false);
				enqueueSnackbar(intl.formatMessage({ id: 'register.message.error' }), { variant: 'error' })
			});
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
						<FormattedMessage id="register" />
					</Typography>
					<Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
						{({ errors, touched, isSubmitting }) => (
							<Form>
								<Field component={TextField} name="name" type="text" variant="outlined" margin="normal" fullWidth
									label={<FormattedMessage id="register.name.label" />} error={errors.name && touched.name} />

								<Field component={TextField} name="email" type="email" variant="outlined" margin="normal" fullWidth
									label={<FormattedMessage id="register.email.label" />} error={errors.email && touched.email} />

								<Field component={TextField} name="password" type="password" variant="outlined" margin="normal" fullWidth
									label={<FormattedMessage id="register.password.label" />} error={errors.password && touched.password} />

								<Field component={TextField} name="confirmPassword" type="password" variant="outlined" margin="normal" fullWidth
									label={<FormattedMessage id="register.confirmPassword.label" />} error={errors.confirmPassword && touched.confirmPassword} />

								<Field
									component={CheckboxWithLabel}
									type="checkbox"
									id="acceptTerms" name="acceptTerms" margin="normal"
									Label={{ label: intl.formatMessage({ id: "register.acceptTerms.title" }) }}
									error={errors.acceptTerms && touched.acceptTerms}
								/>
								<Button
									type="submit"
									fullWidth
									variant="contained"
									color="primary"
									className={classes.submit}
									disabled={isSubmitting}
								>
									<FormattedMessage id="register.action.title" />
								</Button>
								{isSubmitting && <CircularProgress size={24} className={classes.buttonProgress} />}
								<Grid container>
									<Grid item xs>
										<Link href="/account/login" variant="body2">
											<FormattedMessage id="login" />
										</Link>
									</Grid>
									<Grid item>
										<Link href="account/forgot-password" variant="body2">
											<FormattedMessage id="forgot.password" />
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

export default Register;
