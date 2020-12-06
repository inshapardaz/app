import React, { useEffect, useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Slide from "@material-ui/core/Slide";
import Typography from "@material-ui/core/Typography";
import { FormattedMessage, useIntl } from "react-intl";
import { Select } from 'formik-material-ui';
import MenuItem from '@material-ui/core/MenuItem';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
	FormControl,
	Grid,
	InputLabel,
} from "@material-ui/core";
import { TextField, CheckboxWithLabel } from 'formik-material-ui';
import InputBase from '@material-ui/core/InputBase';
import { libraryService } from "../../services";
import { useSnackbar } from 'notistack';


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
	appBar: {
		position: "relative",
	},
	title: {
		marginLeft: theme.spacing(2),
		flex: 1,
	},
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	}
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const LibraryEditor = ({ show, library, createLink, onSaved, onCancelled }) => {
	const { enqueueSnackbar } = useSnackbar();
	const classes = useStyles();
	const intl = useIntl();
	const [busy, setBusy] = useState(false);
	const [savedLibrary, setSavedLibrary] = useState();

	const initialValues = {
		name: '',
		language: 'en',
		supportsPeriodicals: false
	};

	useEffect(() => {
		setSavedLibrary(library);
	}, [library]);

	const validationSchema = Yup.object().shape({
		name: Yup.string()
			.required(intl.formatMessage({ id: 'library.name.error.required' })),
		language: Yup.string()
			.required(intl.formatMessage({ id: 'library.language.error.required' }))
	});

	function onSubmit(fields) {
		if (library === null && createLink !== null) {
			libraryService
				.post(createLink, fields)
				.then(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'library.messages.saving.success' }), { variant: 'success' })
					onSaved();
				})
				.catch(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'library.messages.error.saving' }), { variant: 'error' })
				})
				.finally(() => setBusy(false));
		}
		else if (library !== null) {
			libraryService
				.put(library.links.update, fields)
				.then(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'library.messages.saving.success' }), { variant: 'success' })
					onSaved();
				})
				.catch(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'library.messages.error.saving' }), { variant: 'error' })
				})
				.finally(() => setBusy(false));
		}
	}

	const dialogTitle =
		library === null
			? intl.formatMessage({ id: "library.editor.header.add" })
			: intl.formatMessage(
				{ id: "library.editor.header.edit" },
				{ name: library.name }
			);

	return (
		<Dialog
			fullScreen
			open={show}
			onClose={() => onCancelled()}
			TransitionComponent={Transition}
			disableEscapeKeyDown={busy}
			disableBackdropClick={busy}
		>
			<AppBar className={classes.appBar}>
				<Toolbar>
					<IconButton
						edge="start"
						color="inherit"
						onClick={() => onCancelled()}
						disabled={busy}
						aria-label="close"
					>
						<CloseIcon />
					</IconButton>
					<Typography variant="h6" className={classes.title}>
						{dialogTitle}
					</Typography>
					{/* <Button color="inherit" disabled={isSubmitting} type="submit">
						<FormattedMessage id="action.save" />
					</Button> */}
				</Toolbar>
			</AppBar>
			<DialogContent>
				<Formik initialValues={savedLibrary || initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
					{({ errors, touched, isSubmitting }) => (
						<Form>
							<Field component={TextField} autoFocus name="name" type="text" variant="outlined" margin="normal" fullWidth
								label={<FormattedMessage id="library.name.label" />} error={errors.firstName && touched.firstName}
							/>
							<FormControl variant="outlined" margin="normal" fullWidth error={errors.language && touched.language}>
								<InputLabel ><FormattedMessage id="library.language.label" /></InputLabel>
								<Field component={Select} name="language" as="select" variant="outlined"
									error={errors.language && touched.language}
									input={<BootstrapInput />}>
									<MenuItem value="en">English</MenuItem>
									<MenuItem value="ur">اردو</MenuItem>
									<MenuItem value="hi">हिंदी</MenuItem>
									<MenuItem value="pn">پنجابی</MenuItem>
								</Field>
							</FormControl>
							<Field
								component={CheckboxWithLabel}
								type="checkbox"
								id="supportsPeriodicals" name="supportsPeriodicals" margin="normal"
								label={{ label: intl.formatMessage({ id: "library.supportsPeriodical.label" }) }}
								error={errors.supportsPeriodicals && touched.supportsPeriodicals}
							/>
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
							<Backdrop className={classes.backdrop} open={isSubmitting}>
								<CircularProgress color="inherit" />
							</Backdrop>
						</Form>
					)}
				</Formik>
			</DialogContent>
		</Dialog >


	);
};

export default LibraryEditor;
