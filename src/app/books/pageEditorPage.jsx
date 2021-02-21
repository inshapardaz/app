import React, { useState, useEffect } from 'react';
import { useIntl } from "react-intl";
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import Grid from '@material-ui/core/Grid';

import Editor from 'for-editor'

import ErrorMessage from '../../components/ErrorMessage';
import Loading from '../../components/Loading';
import ImageViewer from '../../components/imageViewer';
import { libraryService } from '../../services';
import { ButtonGroup, Button, Toolbar, AppBar, Typography } from '@material-ui/core';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';

const PageEditorPage = () => {
	const intl = useIntl();
	const imageRef = React.useRef(null);
	const { enqueueSnackbar } = useSnackbar();
	const { bookId, pageId } = useParams();
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
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

	const saveText = (value) => {
		page.text = value;
		libraryService.put(page.links.update, page)
			.then(data => {
				enqueueSnackbar(intl.formatMessage({ id: 'books.messages.saved' }), { variant: 'success' })
			})
			.catch(() => enqueueSnackbar(intl.formatMessage({ id: 'books.messages.error.saving' }), { variant: 'error' }))
			.finally(() => setLoading(false));
	}

	const renderToolbar = () => {
		return (<AppBar position="static" color='transparent' elevation={0} variant="outlined">
			<Toolbar>
				<Typography >Editing page {pageId}</Typography>

				<ButtonGroup size="small" aria-label="small outlined button group">
					<Button onClick={onZoomIn}><ZoomInIcon /></Button>
					<Button onClick={onZoomOut}><ZoomOutIcon /></Button>
				</ButtonGroup>
			</Toolbar>
		</AppBar>)
	};

	if (loading) return <Loading />;

	if (error) return <ErrorMessage message="Error loading page" />;

	if (page == null) return <ErrorMessage message="Page not found" />;

	return (
		<>
			{renderToolbar()}
			<Grid alignContent="stretch" alignItems="stretch" direction="row" container>
				<Grid item xs={6} >
					<Editor value={text} style={{ height: '100%' }} onChange={(value) => setText(value)} placeholder="" language="en" onSave={saveText} />
				</Grid>
				<Grid item xs={6} >
					<ImageViewer scale={scale} imageUrl={page.links && page.links.image ? page.links.image : "/images/no_image.png"} />
				</Grid>
			</Grid>
		</>);
};

export default PageEditorPage;

