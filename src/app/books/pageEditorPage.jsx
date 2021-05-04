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
import { ButtonGroup, Button, Toolbar, Typography, Divider } from '@material-ui/core';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import SaveIcon from '@material-ui/icons/Save';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import Editor from '../../components/editor';

const useStyles = makeStyles((theme) => ({
	container: {
		height: 'calc(100vh - 124px)',
		overflow: 'hidden'
	},
	fullScreen: {
		backgroundColor: 'white',
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		zIndex: 2000,
		height: '100vh',
	},
	pane: {

		height: '100%'
	},
	grow: {
		flexGrow: 1
	},
}));

const PageLink = ({ children, bookId, pageId }) => {
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

	return <Button component={Link} to={`/books/${bookId}/pages/${pageId}/editor`} >
		{children}
	</Button>
}
const PageEditorPage = () => {
	const classes = useStyles();
	const intl = useIntl();
	const imageRef = React.useRef(null);
	const { enqueueSnackbar } = useSnackbar();
	const { bookId, pageId } = useParams();
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [fullScreen, setFullScreen] = useState(false);
	const [font, setFont] = useState('Dubai');
	const [text, setText] = useState("");
	const [page, setPage] = useState(null);
	const [scale, setScale] = useState(100);

	const onZoomIn = () => {
		setScale(scale + 5);
	};

	const onZoomOut = () => {
		setScale(scale - 5);
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
				enqueueSnackbar(intl.formatMessage({ id: 'books.messages.saved' }), { variant: 'success' })
			})
			.catch(() => enqueueSnackbar(intl.formatMessage({ id: 'books.messages.error.saving' }), { variant: 'error' }))
			.finally(() => setLoading(false));
	}

	if (loading) return <Loading />;

	if (error) return <ErrorMessage message="Error loading page" />;

	if (!loading && page == null) return <ErrorMessage message="Page not found" />;

	return (
		<>
			<Grid alignContent="stretch" alignItems="stretch" direction="row" container className={`${classes.container} ${fullScreen ? classes.fullScreen : ''}`}>
				<Grid item xs={6} className={classes.pane}>
					<Toolbar>
						<Typography ><FormattedMessage id="page.editor.header.edit" values={{ sequenceNumber: pageId }} /></Typography>
						<Button onClick={saveText}>
							<SaveIcon /> <FormattedMessage id="action.save" />
						</Button>
						<div className={classes.grow} />
						<PageLink bookId={bookId} pageId={parseInt(pageId) - 1}>
							<KeyboardArrowRightIcon /> <FormattedMessage id="page.edit.previous" />
						</PageLink>
						<PageLink bookId={bookId} pageId={parseInt(pageId) + 1} >
							<FormattedMessage id="page.edit.next" /> <KeyboardArrowLeftIcon />
						</PageLink>
					</Toolbar>
					<Editor data={text} onChange={content => setText(content)} />
				</Grid>
				<Grid item xs={6} className={classes.pane}>
					<Toolbar>
						<ButtonGroup size="small" aria-label="small outlined button group">
							<Button onClick={onZoomIn}><ZoomInIcon /></Button>
							<Button onClick={onZoomOut}><ZoomOutIcon /></Button>
						</ButtonGroup>
						<div className={classes.grow} />
						<Button onClick={() => setFullScreen(!fullScreen)}>
							{fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
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

