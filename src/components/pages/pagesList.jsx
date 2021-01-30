import React, { useState, useEffect, useCallback } from "react";
import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DescriptionIcon from '@material-ui/icons/Description';
import Typography from "@material-ui/core/Typography";
import Tooltip from '@material-ui/core/Tooltip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CircularProgress from "@material-ui/core/CircularProgress";
import { FormattedMessage, useIntl } from "react-intl";
import { libraryService } from "../../services";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import PageEditor from "./pageEditor";
import DeletePage from "./deletePage";
import Link from "@material-ui/core/Link";

const useStyles = () =>
	makeStyles((theme) => ({
		cardGrid: {
			paddingTop: theme.spacing(8),
			paddingBottom: theme.spacing(8),
		},
	}));
const classes = useStyles();

const PagesList = ({ book }) => {
	if (book == null || book.links.pages == null) return null;

	const intl = useIntl();
	const [isLoading, setLoading] = useState(true);
	const [isError, setError] = useState(false);
	const [showEditor, setShowEditor] = useState(false);
	const [showDelete, setShowDelete] = useState(false);
	const [selectedPage, setSelectedPage] = useState(null);

	const [pages, setPages] = useState({});

	const loadData = () => {
		setLoading(true);
		libraryService
			.getBookPages(book)
			.then((data) => {
				setPages(data);
			})
			.catch((e) => setError(true))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		loadData();
	}, []);

	const handleDataChanged = () => {
		handleClose();
		loadData();
	};

	const handleClose = () => {
		setSelectedPage(null);
		setShowEditor(false);
		setShowDelete(false);
	};

	const onEditClicked = useCallback(
		(page) => {
			setSelectedPage(page);
			setShowEditor(true);
		},
		[pages]
	);

	const onDeleteClicked = useCallback(
		(page) => {
			setSelectedPage(page);
			setShowDelete(true);
		},
		[pages]
	);

	const onUploadClicked = useCallback(
		(page) => {
			console.log("upload clicked")
		},
		[pages]
	);

	const handleFileUpload = useCallback(
		(files) => {
			if (files.length < 1) {
				return;
			}

			setLoading(true);
			if (pages && pages.links.create !== null) {
				libraryService.postFile(pages.links.create, files[0])
					.then(() => {
						enqueueSnackbar(intl.formatMessage({ id: 'books.messages.saved' }), { variant: 'success' })
						onSaved();
					})
					.catch(() => {
						enqueueSnackbar(intl.formatMessage({ id: 'books.messages.error.saving' }), { variant: 'error' })
					})
					.finally(() => setLoading(false));
			}
		}, [pages]
	);

	const renderToolBar = () => {
		if (pages && pages.links && pages.links.create) {
			return (
				<Toolbar>
					<IconButton
						edge="start"
						className={classes.menuButton}
						color="inherit"
						aria-label="menu"
						onClick={() => onEditClicked(null)}
					>
						<AddCircleIcon />
					</IconButton>
				</Toolbar>
			);
		}

		return null;
	};

	const renderPages = () => {
		if (isLoading) {
			return <CircularProgress />;
		}

		if (isError) {
			return (
				<Typography variant="h6" component="h6" align="center">
					<FormattedMessage id="chapters.messages.error.loading" />
				</Typography>
			);
		}

		if (pages === null || pages.data === null || pages.data.length < 1) {
			return (
				<Typography variant="h6" component="h6" align="center">
					<FormattedMessage id="chapters.messages.empty" />
				</Typography>
			);
		}
		return (<List >
			{pages.data.map(p => (
				<ListItem key={p.sequenceNumber}>
					<ListItemAvatar>
						<Typography variant="body1" align="center">{p.sequenceNumber}
						</Typography>
					</ListItemAvatar>
					<ListItemText
						primary={p.accountId && (<FormattedMessage id="page.assignedTo.label" values={{ name: p.accountName }} />)}
					/>
					<ListItemSecondaryAction>
						<Tooltip title={<FormattedMessage id="action.edit" />} >
							<IconButton edge="end" aria-label="edit" onClick={() => onEditClicked(p)}>
								<EditIcon />
							</IconButton>
						</Tooltip>
						<Tooltip title={<FormattedMessage id="action.delete" />} >
							<IconButton edge="end" aria-label="delete" onClick={() => onDeleteClicked(p)}>
								<DeleteIcon />
							</IconButton>
						</Tooltip>
					</ListItemSecondaryAction>
				</ListItem>
			))
			}
		</List >);
	}

	return (
		<Container className={classes.cardGrid} maxWidth="md">
			{renderToolBar()}
			{renderPages()}
			<PageEditor
				show={showEditor}
				page={selectedPage}
				createLink={pages && pages.links && pages.links.create}
				pageNumber={pages && pages.data && pages.data.length}
				onSaved={handleDataChanged}
				onCancelled={handleClose}
			/>
			<DeletePage
				show={showDelete}
				page={selectedPage}
				onDeleted={handleDataChanged}
				onCancelled={handleClose}
			/>
		</Container>
	);
};

export default PagesList;
