import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

import { makeStyles, withStyles } from '@material-ui/core/styles';

import { Container, Typography, FormControl } from '@material-ui/core';
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
		firstName: Yup.string()
			.required(intl.formatMessage({ id: 'register.message.firstName.required' })),
		lastName: Yup.string()
			.required(intl.formatMessage({ id: 'register.message.lastName.required' }))
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
							<Field component={TextField} name="firstName" type="text" variant="outlined" margin="normal" fullWidth
								label={<FormattedMessage id="register.firstName.label" />} error={errors.firstName && touched.firstName} />

							<Field component={TextField} name="lastName" type="text" variant="outlined" margin="normal" fullWidth
								label={<FormattedMessage id="register.lastName.label" />} error={errors.lastName && touched.lastName} />

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
										to="."
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
