import React, { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

import { makeStyles, withStyles } from '@material-ui/core/styles';

import { Container, Typography, Link, FormControl } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Select } from 'formik-material-ui';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { useSnackbar } from 'notistack';
import { accountService } from '../../services';
import { TextField } from 'formik-material-ui';
import { useIntl, FormattedMessage } from 'react-intl';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

const BootstrapInput = withStyles((theme) => ({
	root: {
		'label + &': {
			marginTop: theme.spacing(3),
		},
	},
	input: {
		borderRadius: 4,
		position: 'relative',
		backgroundColor: theme.palette.background.paper,
		border: '1px solid #ced4da',
		fontSize: 16,
		padding: '19px 26px 19px 14px',
		transition: theme.transitions.create(['border-color', 'box-shadow']),
		'&:focus': {
			borderRadius: 4,
			borderColor: '#80bdff',
			boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
		},
	},
}))(InputBase);

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

function Update({ history }) {
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();
	const user = accountService.userValue;
	const initialValues = {
		title: user.title,
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email,
		password: '',
		confirmPassword: ''
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
			.min(6, intl.formatMessage({ id: 'register.message.password.error.length' })),
		confirmPassword: Yup.string()
			.when('password', (password, schema) => {
				if (password) return schema.required(intl.formatMessage({ id: 'register.message.confirmPassword.required' }));
			})
			.oneOf([Yup.ref('password')], intl.formatMessage({ id: 'register.message.confirmPassword.error.match' }))
	});

	function onSubmit(fields, { setStatus, setSubmitting }) {
		setStatus();
		accountService.update(user.id, fields)
			.then(() => {
				enqueueSnackbar(intl.formatMessage({ id: 'profile.message.success' }), { variant: 'success' })
				history.push('.');
			})
			.catch(() => {
				setSubmitting(false);
				enqueueSnackbar(intl.formatMessage({ id: 'profile.message.error' }), { variant: 'error' })
			});
	}

	return (
		<Container component="main" maxWidth="xs">
			<div className={classes.paper}>
				<Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
					{({ errors, touched, isSubmitting }) => (
						<Form>
							<FormControl variant="outlined" margin="normal" fullWidth error={errors.title && touched.title}>
								<InputLabel ><FormattedMessage id="register.title.label" /></InputLabel>
								<Field component={Select} name="title" as="select" ariant="outlined" margin="normal" fullWidth
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

							<Typography component="h1" variant="h5">
								<FormattedMessage id="changePassword" />
							</Typography>

							<Field component={TextField} name="password" type="password" variant="outlined" margin="normal" fullWidth
								label={<FormattedMessage id="register.password.label" />} error={errors.password && touched.password} />

							<Field component={TextField} name="confirmPassword" type="password" variant="outlined" margin="normal" fullWidth
								label={<FormattedMessage id="register.confirmPassword.label" />} error={errors.confirmPassword && touched.confirmPassword} />

							{isSubmitting && <CircularProgress size={24} className={classes.buttonProgress} />}
							<Grid container spacing={2}>
								<Grid item xs={6}>
									<Button
										type="submit"
										fullWidth
										variant="contained"
										color="primary"
										className={classes.submit}
										disabled={isSubmitting}
									>
										<FormattedMessage id="action.save" />
									</Button>
								</Grid>
								<Grid item xs={6} >
									<Button component={Link}
										href="."
										fullWidth
										variant="contained"
										className={classes.submit}
										disabled={isSubmitting}>
										<FormattedMessage id="action.cancel" />
									</Button>
								</Grid>
							</Grid>
						</Form>
					)}
				</Formik>
			</div>
		</Container>
	)
}

export { Update };
