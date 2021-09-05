import React, { useEffect } from 'react';
import { Formik, Field, Form } from 'formik';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';

import { makeStyles } from '@material-ui/core/styles';

import { Container, Typography, FormControl } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Select } from 'formik-material-ui';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { useSnackbar } from 'notistack';
import { accountService } from '../../../services';
import { TextField } from 'formik-material-ui';
import { useIntl, FormattedMessage } from 'react-intl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import BootstrapInput from '../../../components/bootstrapInput';

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

function AddEdit({ history, match }) {
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();
	const { id } = match.params;
	const isAddMode = !id;

	const initialValues = {
		name: '',
		email: '',
		role: '',
		password: '',
		confirmPassword: ''
	};

	const validationSchema = Yup.object().shape({
		name: Yup.string()
			.required(intl.formatMessage({ id: 'register.message.name.required' })),
		email: Yup.string()
			.email(intl.formatMessage({ id: 'register.message.email.error' }))
			.required(intl.formatMessage({ id: 'register.message.email.required' })),
		role: Yup.string()
			.required(intl.formatMessage({ id: 'user.role.required' })),
		password: Yup.string()
			.concat(isAddMode ? Yup.string().required('Password is required') : null)
			.min(6, intl.formatMessage({ id: 'register.message.password.error.length' })),
		confirmPassword: Yup.string()
			.when('password', (password, schema) => {
				if (password) return schema.required(intl.formatMessage({ id: 'register.message.confirmPassword.required' }));
			})
			.oneOf([Yup.ref('password')], intl.formatMessage({ id: 'register.message.confirmPassword.error.match' }))
	});

	function onSubmit(fields, { setStatus, setSubmitting }) {
		setStatus();
		if (isAddMode) {
			createUser(fields, setSubmitting);
		} else {
			updateUser(id, fields, setSubmitting);
		}
	}

	function createUser(fields, setSubmitting) {
		accountService.create(fields)
			.then(() => {
				enqueueSnackbar(intl.formatMessage({ id: 'user.messages.added.success' }), { variant: 'success' })
				history.push('.');
			})
			.catch(error => {
				setSubmitting(false);
				enqueueSnackbar(intl.formatMessage({ id: 'user.messages.added.error' }), { variant: 'error' })
			});
	}

	function updateUser(id, fields, setSubmitting) {
		accountService.update(id, fields)
			.then(() => {
				enqueueSnackbar(intl.formatMessage({ id: 'user.messages.updated.success' }), { variant: 'success' })
				history.push('..');
			})
			.catch(error => {
				setSubmitting(false);
				enqueueSnackbar(intl.formatMessage({ id: 'user.messages.updated.error' }), { variant: 'error' })
			});
	}

	return (
		<Container component="main" maxWidth="xs">
			<div className={classes.paper}>
				<Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
					{({ errors, touched, isSubmitting, setFieldValue }) => {
						useEffect(() => {
							if (!isAddMode) {
								// get user and set form fields
								accountService.getById(id).then(user => {
									const fields = ['name', 'email', 'role'];
									fields.forEach(field => setFieldValue(field, user[field], false));
								});
							}
						}, []);

						return (
							<Form>
								<Typography variant="h3">{intl.formatMessage({ id: isAddMode ? 'user.add' : 'user.edit' })}</Typography>
								<Field component={TextField} name="name" type="text" variant="outlined" margin="normal" fullWidth
									label={<FormattedMessage id="register.name.label" />} error={errors.name && touched.name} />

								<Field component={TextField} name="email" type="email" variant="outlined" margin="normal" fullWidth
									label={<FormattedMessage id="register.email.label" />} error={errors.email && touched.email} />

								<FormControl variant="outlined" margin="normal" fullWidth error={errors.role && touched.role}>
									<InputLabel ><FormattedMessage id="user.role.label" /></InputLabel>
									<Field component={Select} name="role" as="select" ariant="outlined" margin="normal" fullWidth
										error={errors.role && touched.role}
										input={<BootstrapInput />}>
										<MenuItem value="">{intl.formatMessage({ id: "register.title.none" })}</MenuItem>
										<MenuItem value="Reader">{intl.formatMessage({ id: "role.reader" })}</MenuItem>
										<MenuItem value="Writer">{intl.formatMessage({ id: "role.writer" })}</MenuItem>
										<MenuItem value="LibraryAdmin">{intl.formatMessage({ id: "role.libraryAdmin" })}</MenuItem>
									</Field>
								</FormControl>

								{!isAddMode &&
									<Typography variant="h3">{intl.formatMessage({ id: 'changePassword' })}</Typography>
								}
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
											to='/admin/users'
											fullWidth
											variant="contained"
											className={classes.submit}
											disabled={isSubmitting}>
											<FormattedMessage id="action.cancel" />
										</Button>
									</Grid>
								</Grid>
							</Form>
						);
					}}
				</Formik>
			</div>
		</Container >
	);
}

export { AddEdit };
