import React from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

import { makeStyles } from '@material-ui/core/styles';

import { Container, Typography, Link, Avatar, FormControl } from '@material-ui/core';
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
import LanguageSelector from '../../components/header/languageSelector.jsx';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Footer from '../../components/footer';

import BootstrapInput from '../../components/bootstrapInput';


const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
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
		title: '',
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: '',
		acceptTerms: false
	};

	const validationSchema = Yup.object().shape({
		title: Yup.string()
			.required(intl.formatMessage({ id: 'register.message.title.required' })),
		firstName: Yup.string()
			.required(intl.formatMessage({ id: 'register.message.firstName.required' })),
		lastName: Yup.string()
			.required(intl.formatMessage({ id: 'register.message.lastName.required' })),
		email: Yup.string()
			.email(intl.formatMessage({ id: 'register.message.email.error' }))
			.required(intl.formatMessage({ id: 'register.message.email.required' })),
		password: Yup.string()
			.min(6, intl.formatMessage({ id: 'register.message.password.error.length' }))
			.required(intl.formatMessage({ id: 'register.message.password.required' })),
		confirmPassword: Yup.string()
			.oneOf([Yup.ref('password'), null], intl.formatMessage({ id: 'egister.message.confirmPassword.error.match' }))
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
		<Container component="main" maxWidth="xs">
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
							<FormControl variant="outlined" margin="normal" fullWidth error={errors.title && touched.title}>
								<InputLabel ><FormattedMessage id="register.title.label" /></InputLabel>
								<Field component={Select} name="title" as="select" variant="outlined" margin="normal" fullWidth
									error={errors.title && touched.title}
									input={<BootstrapInput />}>
									<MenuItem value="">{intl.formatMessage({ id: "register.title.none" })}</MenuItem>
									<MenuItem value="Mr">{intl.formatMessage({ id: "register.title.mr" })}</MenuItem>
									<MenuItem value="Mrs">{intl.formatMessage({ id: "register.title.mrs" })}</MenuItem>
									<MenuItem value="Miss">{intl.formatMessage({ id: "register.title.miss" })}</MenuItem>
								</Field>
							</FormControl>

							<Field component={TextField} name="firstName" type="text" variant="outlined" margin="normal" fullWidth
								label={<FormattedMessage id="register.firstName.label" />} error={errors.firstName && touched.firstName} />

							<Field component={TextField} name="lastName" type="text" variant="outlined" margin="normal" fullWidth
								label={<FormattedMessage id="register.lastName.label" />} error={errors.lastName && touched.lastName} />

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
								fullWidth
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
									<Link href="/account/login" variant="body2"><FormattedMessage id="login" /></Link>
								</Grid>
								<Grid item xs>
									<LanguageSelector />
								</Grid>
							</Grid>
						</Form>
					)}
				</Formik>
			</div>
			<Box mt={8}>
				<Footer />
			</Box>
		</Container>
	)
}

export default Register;
