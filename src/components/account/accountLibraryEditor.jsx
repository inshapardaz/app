import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { makeStyles } from '@material-ui/core/styles';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, IconButton, Button } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import EditorDialog from '../editorDialog';
import { accountService } from "../../services";
import { useSnackbar } from 'notistack';
import DeleteAccountLibrary from "./deleteAccountLibrary";
import LibrarySelectDialog from '../library/librarySelector';

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

const AccountLibraryEditor = ({ show, account, onCancelled }) => {
	const classes = useStyles();
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [busy, setBusy] = useState(false);
	const [libraries, setLibraries] = useState(null);
	const [showAdd, setShowAdd] = useState(false);
	const [showDelete, setShowDelete] = useState(false);
	const [selectedLibrary, setSelectedLibrary] = useState(null);

	const loadData = () => {
		setLoading(true);
		accountService.getAccountLibraries(account.id)
			.then((data) => {
				setLibraries(data);
			})
			.catch(() => setError(true))
			.finally(() => setLoading(false));
	};
	useEffect(() => {
		if (account !== null) {
			loadData();
		}
	}, [account]);

	const deleteLibrary = (library) => {
		setSelectedLibrary(library);
		setShowDelete(true);
	};

	const addLibrary = (library) => {
		setBusy(true);
		accountService.addAccountLibrary(account.id, library.id)
			.then(() => {
				enqueueSnackbar(intl.formatMessage({ id: 'library.assign.success' }), { variant: 'success' })
				handleDataChanged();
			})
			.catch((e) => {
				console.error(e);
				enqueueSnackbar(intl.formatMessage({ id: 'library.assign.error' }), { variant: 'error' })
				setError(true);
			})
			.finally(() => setBusy(false));
	};

	const handleDataChanged = () => {
		loadData();
		handleClose();
	};

	const handleClose = () => {
		setSelectedLibrary(null);
		setShowAdd(false);
		setShowDelete(false);
	};

	if (account === null) return (<></>);

	const dialogTitle = intl.formatMessage({ id: "account.library.editor" }, { name: account !== null ? account.name : '' });

	return (
		<EditorDialog show={show} busy={loading} title={dialogTitle} onCancelled={() => onCancelled()} >
			<TableContainer component={Paper}>
				<Table className={classes.table}>
					<TableHead>
						<TableRow>
							<TableCell style={{ width: '90%' }}><FormattedMessage id="library.name.label" /></TableCell>
							<TableCell style={{ width: '10%' }}></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{libraries && libraries.data && libraries.data.map(library =>
							<TableRow key={library.id}>
								<TableCell>{library.name}</TableCell>
								<TableCell>
									<IconButton onClick={() => deleteLibrary(library)} >
										<DeleteIcon />
									</IconButton>
								</TableCell>
							</TableRow>
						)}
						<TableRow>
							<TableCell colSpan="4" className="text-center">
								<Button onClick={() => setShowAdd(true)} ><FormattedMessage id="library.assign" /></Button>
							</TableCell>
						</TableRow>
						{loading &&
							<TableRow>
								<TableCell colSpan="4" className="text-center">
									<span className="spinner-border spinner-border-lg align-center"></span>
								</TableCell>
							</TableRow>
						}
					</TableBody>
				</Table>
			</TableContainer>
			<LibrarySelectDialog open={showAdd} onLibrarySelected={addLibrary} onClose={handleClose} />
			<DeleteAccountLibrary
				show={showDelete}
				library={selectedLibrary}
				account={account}
				onDeleted={handleDataChanged}
				onCancelled={handleClose}
			/>
		</EditorDialog>
	);
};

export default AccountLibraryEditor;
