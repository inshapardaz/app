import React, { useState, useEffect, useCallback } from "react";
import { useSnackbar } from 'notistack';
import { FormattedMessage, useIntl } from "react-intl";
import { useConfirm } from 'material-ui-confirm';

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
import { libraryService } from "../../services";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import ChapterEditor from "./chapterEditor";
import Link from '@material-ui/core/Link';

const useStyles = () =>
	makeStyles((theme) => ({
		cardGrid: {
			paddingTop: theme.spacing(8),
			paddingBottom: theme.spacing(8),
		},
	}));
const classes = useStyles();

const ChapterList = ({ book, allowEdit = true }) => {
	if (book == null) return null;
	const confirm = useConfirm();
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();
	const [showEditor, setShowEditor] = useState(false);
	const [selectedChapter, setSelectedChapter] = useState(null);

	const [chapters, setChapters] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const [isError, setError] = useState(false);
	const loadData = () => {
		setLoading(true);
		libraryService
			.getBookChapters(book)
			.then((data) => {
				setChapters(data);
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
		setSelectedChapter(null);
		setShowEditor(false);
	};

	const onEditClicked = useCallback(
		(chapter) => {
			setSelectedChapter(chapter);
			setShowEditor(true);
		},
		[chapters]
	);

	const onDeleteClicked = useCallback(
		(chapter) => {
			confirm({
				title: intl.formatMessage({ id: "action.delete" }),
				description: intl.formatMessage({ id: "chapters.action.confirmDelete" }, { title: chapter.title }),
				confirmationText: intl.formatMessage({ id: "action.yes" }),
				cancellationText: intl.formatMessage({ id: "action.no" }),
				confirmationButtonProps: { variant: "contained", color: "secondary" },
				cancellationButtonProps: { color: "secondary" }
			})
				.then(() => {
					return libraryService.delete(chapter.links.delete)
						.then(() => enqueueSnackbar(intl.formatMessage({ id: 'chapters.messages.deleted' }), { variant: 'success' }))
						.then(() => loadData())
						.catch(() => enqueueSnackbar(intl.formatMessage({ id: 'chapters.messages.error.delete' }), { variant: 'error' }));
				}).catch(() => { })

		},
		[chapters]
	);

	if (chapters == null) return null;

	const renderToolBar = () => {
		if (allowEdit && chapters && chapters.links.create) {
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

	const renderChapters = () => {
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

		if (chapters === null || chapters.data === null || chapters.data.length < 1) {
			return (
				<Typography variant="h6" component="h6" align="center">
					<FormattedMessage id="chapters.messages.empty" />
				</Typography>
			);
		}
		return (<List >
			{chapters.data.map(c => (
				<ListItem key={c.id}>
					<ListItemAvatar>
						<Typography variant="body1" align="center">{c.chapterNumber}</Typography>
					</ListItemAvatar>
					<ListItemText
						primary={<Link href={`/books/${c.bookId}/chapter/${c.chapterNumber}`} color="inherit" variant="body1" >{c.title}</Link>}
					/>
					{ allowEdit &&
						<ListItemSecondaryAction>
							<Tooltip title={<FormattedMessage id="chapter.action.editContent" />} >
								<IconButton edge="end" aria-label="edit contents" href={`/books/${c.bookId}/chapter/${c.chapterNumber}/editor`}>
									<DescriptionIcon />
								</IconButton>
							</Tooltip>
							<Tooltip title={<FormattedMessage id="action.edit" />} >
								<IconButton edge="end" aria-label="edit" onClick={() => onEditClicked(c)}>
									<EditIcon />
								</IconButton>
							</Tooltip>
							<Tooltip title={<FormattedMessage id="action.delete" />} >
								<IconButton edge="end" aria-label="delete" onClick={() => onDeleteClicked(c)}>
									<DeleteIcon />
								</IconButton>
							</Tooltip>
						</ListItemSecondaryAction>
					}
				</ListItem>
			))
			}
		</List >);
	}

	return (
		<Container className={classes.cardGrid} maxWidth="md">
			{renderToolBar()}
			{renderChapters()}
			<ChapterEditor
				show={showEditor}
				chapter={selectedChapter}
				createLink={chapters && chapters.links.create}
				chapterCount={chapters.data.length}
				onSaved={handleDataChanged}
				onCancelled={handleClose}
			/>
		</Container>
	);
};

export default ChapterList
