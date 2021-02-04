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
import { Button, Toolbar } from '@material-ui/core';

const PageEditorPage = () => {
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();
	const { bookId, pageId } = useParams();
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [font, setFont] = useState('Dubai');
	const [text, setText] = useState("");
	const [page, setPage] = useState(null);

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

	if (loading) return <Loading />;

	if (error) return <ErrorMessage message="Error loading page" />;

	if (page == null) return <ErrorMessage message="Page not found" />;

	return (
		<>
			<Grid alignContent="stretch" alignItems="stretch" direction="row" spacing={5} container>
				<Grid item xs={6} >
					<Editor value={text} onChange={(value) => setText(value)} placeholder="" language="en" onSave={saveText} />
				</Grid>
				<Grid item xs={6} >
					<ImageViewer src={page.links && page.links.image ? page.links.image : "/images/no_image.png"} />
				</Grid>
			</Grid>
		</>)
};

export default PageEditorPage;

