import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { FormControl, InputLabel, Typography, Grid, Button, MenuItem, Link, CircularProgress } from "@material-ui/core";
import { TextField, Select } from 'formik-material-ui';
import BootstrapInput from '../bootstrapInput';
import EditorDialog from '../editorDialog';
import { accountService } from "../../services";
import SubmitButton from "../submitButton";


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

const AccountEditor = ({ show, account, createLink, onSaved, onCancelled }) => {
	const classes = useStyles();
	const { enqueueSnackbar } = useSnackbar();
	const intl = useIntl();
	const [busy, setBusy] = useState(false);
	const [savedAccount, setSavedAccount] = useState();
	const isAddMode = savedAccount === null;

	const initialValues = {
		title: '',
		firstName: '',
		lastName: '',
		email: '',
		role: '',
		password: '',
		confirmPassword: ''
	};

	useEffect(() => {
		setSavedAccount(account);
	}, [account]);

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
		if (account === null && createLink !== null) {
			createUser(fields, setSubmitting);
		} else {
			updateUser(account.id, fields, setSubmitting);
		}
	}

	function createUser(fields, setSubmitting) {
		accountService.create(fields)
			.then(() => {
				enqueueSnackbar(intl.formatMessage({ id: 'user.messages.added.success' }), { variant: 'success' })
				onSaved();
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
				onSaved();
			})
			.catch(error => {
				setSubmitting(false);
				enqueueSnackbar(intl.formatMessage({ id: 'user.messages.updated.error' }), { variant: 'error' })
			});
	}

	const dialogTitle =
		account === null
			? intl.formatMessage({ id: "user.add" })
			: intl.formatMessage({ id: "user.edit" });

	return (
		<EditorDialog show={show} busy={busy} title={dialogTitle} onCancelled={() => onCancelled()}  >
			<Formik initialValues={savedAccount || initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
				{({ errors, touched, isSubmitting }) => (
					<Form>
						<Typography variant="h3">{intl.formatMessage({ id: isAddMode ? 'user.add' : 'user.edit' })}</Typography>
						<FormControl variant="outlined" margin="normal" fullWidth error={errors.title && touched.title}>
							<InputLabel ><FormattedMessage id="register.title.label" /></InputLabel>
							<Field component={Select} name="title" as="select" ariant="outlined" fullWidth
								error={errors.title && touched.title}
								input={<BootstrapInput />}>
								<MenuItem value="">{intl.formatMessage({ id: "register.title.none" })}</MenuItem>
								<MenuItem value="Mr">{intl.formatMessage({ id: "register.title.mr" })}</MenuItem>
								<MenuItem value="Mrs">{intl.formatMessage({ id: "register.title.mrs" })}</MenuItem>
								<MenuItem value="Miss">{intl.formatMessage({ id: "register.title.miss" })}</MenuItem>
							</Field>
						</FormControl>
						<Field component={TextField} name="firstName" margin="normal" type="text" variant="outlined" fullWidth
							label={<FormattedMessage id="register.firstName.label" />} error={errors.firstName && touched.firstName} />

						<Field component={TextField} name="lastName" margin="normal" type="text" variant="outlined" fullWidth
							label={<FormattedMessage id="register.lastName.label" />} error={errors.lastName && touched.lastName} />

						<Field component={TextField} name="email" margin="normal" type="email" variant="outlined" fullWidth
							label={<FormattedMessage id="register.email.label" />} error={errors.email && touched.email} />

						<FormControl variant="outlined" fullWidth margin="normal" error={errors.role && touched.role}>
							<InputLabel ><FormattedMessage id="user.role.label" /></InputLabel>
							<Field component={Select} name="role" as="select" variant="outlined" fullWidth
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
						<Field component={TextField} name="password" margin="normal" type="password" variant="outlined" fullWidth
							label={<FormattedMessage id="register.password.label" />} error={errors.password && touched.password} />

						<Field component={TextField} name="confirmPassword" margin="normal" type="password" variant="outlined" fullWidth
							label={<FormattedMessage id="register.confirmPassword.label" />} error={errors.confirmPassword && touched.confirmPassword} />


						{isSubmitting && <CircularProgress size={24} className={classes.buttonProgress} />}
						<SubmitButton busy={isSubmitting} label={<FormattedMessage id="action.save" />} />
					</Form>
				)}
			</Formik>
		</EditorDialog>
	);
};

export default AccountEditor;
