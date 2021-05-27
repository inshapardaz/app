import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { FormattedMessage, useIntl } from "react-intl";

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import ErrorMessage from '../../components/ErrorMessage';
import Loading from '../../components/Loading';
import ImageViewer from '../../components/imageViewer';
import { libraryService } from '../../services';
import { ButtonGroup, Button, Toolbar, Typography, Divider, Tooltip } from '@material-ui/core';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import SaveIcon from '@material-ui/icons/Save';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import SpellcheckIcon from '@material-ui/icons/Spellcheck';
import DoneIcon from '@material-ui/icons/Done';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import CloseIcon from '@material-ui/icons/Close';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import Editor from '../../components/editor';
import FontDropdown from '../../components/fontDropDown';
import PageStatus from '../../models/pageStatus';
import PageAssignButton from '../../components/pages/pageAssignButton';
import PageOcrButton from '../../components/pages/pageOcrButton';
import PageStatusIcon from '../../components/pages/pageStatusIcon';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
	container: {
		height: 'calc(100vh - 124px)',
		paddingLeft: '4px',
		overflow: 'hidden'
	},
	fullScreen: {
		backgroundColor: 'white',
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		zIndex: 1300,
		height: '100vh',
	},
	pane: {
		height: '100%'
	},
	grow: {
		flexGrow: 1
	},
	doneButton: {
		color: theme.palette.getContrastText(green[500]),
		backgroundColor: green[500],
		'&:hover': {
			backgroundColor: green[700],
		}
	}
}));

const PageLink = ({ children, bookId, pageId, title }) => {
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(null);
	const loadData = () => {
		setLoading(true);
		libraryService.getPage(bookId, pageId)
			.then(data => {
				setPage(data);
			})
			.finally(() => setLoading(false));
	};


	useEffect(() => {
		loadData();
	}, [pageId]);

	if (loading) return null;
	if (page == null) return null;

	return (
		<Tooltip title={title}>
			<Button component={Link} to={`/books/${bookId}/pages/${pageId}/editor`} >
				{children}
			</Button>
		</Tooltip >
	);
}

const CompleteButton = ({ page, onUpdated }) => {
	const classes = useStyles();
	const [busy, setBusy] = useState(false);
	const { enqueueSnackbar } = useSnackbar();
	const intl = useIntl();

	let icon = null;
	let newStatus = null;

	if (page.status === PageStatus.Typing) {
		newStatus = PageStatus.Typed;
		icon = <SpellcheckIcon />;
	}
	else if (page.status === PageStatus.InReview) {
		newStatus = PageStatus.Completed;
		icon = <DoneIcon />;
	}
	else {
		return null;
	}

	const onComplete = () => {
		if (page.links.update && newStatus) {
			setBusy(true);
			page.status = newStatus;
			libraryService.put(page.links.update, page)
				.then(() => enqueueSnackbar(intl.formatMessage({ id: 'page.messages.saved' }), { variant: 'success' }))
				.then(() => onUpdated && onUpdated())
				.catch(() => enqueueSnackbar(intl.formatMessage({ id: 'page.messages.error.saving' }), { variant: 'error' }))
				.finally(() => setBusy(false));
		}
	}

	return (<Button startIcon={icon} variant="contained" color="primary" className={classes.doneButton} onClick={onComplete} disabled={busy}>
		<FormattedMessage id="action.done" />
	</Button>);
}

const PageEditorPage = () => {
	const classes = useStyles();
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();
	const { bookId, pageId } = useParams();
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [fullScreen, setFullScreen] = useState(false);
	const [font, setFont] = useState(localStorage.getItem('editorFont') || 'Dubai');
	const [text, setText] = useState("");
	const [page, setPage] = useState(null);
	const [scale, setScale] = useState(100);
	const [textScale, setTextScale] = useState(localStorage.getItem('editor.fontSize') || 1.0);

	const onZoomIn = () => {
		setScale(scale + 5);
	};

	const onZoomOut = () => {
		if (scale > 5) {
			setScale(scale - 5);
		}
	};

	const onZoomInText = () => {
		if (parseFloat(textScale) < 3.0) {
			let newScale = (parseFloat(textScale) + 0.1).toFixed(2);
			setTextScale(newScale);
			localStorage.setItem('editor.fontSize', newScale);
		}
	};

	const onZoomOutText = () => {
		if (parseFloat(textScale) > 1) {
			let newScale = (parseFloat(textScale) - 0.1).toFixed(2);
			setTextScale(newScale);
			localStorage.setItem('editor.fontSize', newScale);
		}
	};

	const loadData = () => {
		setLoading(true);
		var editorFont = localStorage.getItem('editorFont');
		if (editorFont == null) {
			setFont('Dubai');
			localStorage.setItem('editorFont', 'Dubai');
		}

		libraryService.getPage(bookId, pageId)
			.then(data => {
				setPage(data);
				setText(data.text);
			})
			.catch(() => setError(true))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		loadData();
	}, [pageId]);

	const saveText = () => {
		page.text = text;
		libraryService.put(page.links.update, page)
			.then(data => {
				setPage(data);
				enqueueSnackbar(intl.formatMessage({ id: 'books.messages.saved' }), { variant: 'success' })
			})
			.catch(() => enqueueSnackbar(intl.formatMessage({ id: 'books.messages.error.saving' }), { variant: 'error' }))
			.finally(() => setLoading(false));
	}

	if (loading) return <Loading />;

	if (error) return <ErrorMessage message="Error loading page" />;

	if (!loading && page == null) return <ErrorMessage message="Page not found" />;

	var header = '';
	if (page.status === PageStatus.Typing) {
		header = (<FormattedMessage id="page.editor.header.edit" values={{ sequenceNumber: pageId }} />);
	}
	else if (page.status === PageStatus.InReview) {
		header = (<FormattedMessage id="page.editor.header.proofread" values={{ sequenceNumber: pageId }} />);
	}
	else
		header = (<FormattedMessage id="page.editor.header" values={{ sequenceNumber: pageId }} />);

	return (
		<>
			<Grid alignContent="stretch" alignItems="stretch" direction="row" container className={`${classes.container} ${fullScreen ? classes.fullScreen : ''}`}>
				<Grid item xs={6} className={classes.pane}>
					<Toolbar>
						<PageStatusIcon status={page.status} />
						<Typography >{header}</Typography>
						<Tooltip title={<FormattedMessage id="action.save" />}>
							<Button onClick={saveText}>
								<SaveIcon />
							</Button>
						</Tooltip>
						{page.links.assign_to_me &&
							<PageAssignButton selectedPages={[page]} />
						}
						{page.links.ocr && <PageOcrButton selectedPages={[page]} onComplete={loadData} />}
						<div className={classes.grow} />
						<ButtonGroup size="small" aria-label="small outlined button group">
							<FontDropdown variant="outlined" value={font} onFontSelected={f => setFont(f)} storageKey={"editorFont"} />
							<Button onClick={onZoomInText} disabled={parseFloat(textScale) >= 3}><ZoomInIcon /></Button>
							<Button onClick={onZoomOutText} disabled={parseFloat(textScale) <= 1}><ZoomOutIcon /></Button>
						</ButtonGroup>
					</Toolbar>
					<Editor data={text} onChange={content => setText(content)} textScale={textScale} fullScreen={fullScreen} font={font} />
				</Grid>
				<Grid item xs={6} className={classes.pane}>
					<Toolbar>
						<ButtonGroup size="small" aria-label="small outlined button group">
							<Button onClick={onZoomIn}><ZoomInIcon /></Button>
							<Button onClick={onZoomOut}><ZoomOutIcon /></Button>
						</ButtonGroup>
						<div className={classes.grow} />
						<CompleteButton page={page} onUpdated={loadData} />
						<PageLink bookId={bookId} pageId={parseInt(pageId) - 1}
							title={<FormattedMessage id="page.edit.previous" />}>
							<KeyboardArrowRightIcon />
						</PageLink>
						<PageLink bookId={bookId} pageId={parseInt(pageId) + 1}
							title={<FormattedMessage id="page.edit.next" />}>
							<KeyboardArrowLeftIcon />
						</PageLink>
						<Button onClick={() => setFullScreen(!fullScreen)}>
							{fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
						</Button>
						<Button component={Link} to={`/books/${bookId}/pages`}>
							<CloseIcon />
						</Button>
					</Toolbar>
					<ImageViewer scale={scale}
						imageUrl={page && page.links && page.links.image ? page.links.image : "/images/no_image.png"}
						fullScreen={fullScreen}
					/>
				</Grid>
			</Grid>
		</>);
};

export default PageEditorPage;

