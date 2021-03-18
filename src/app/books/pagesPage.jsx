import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FormattedMessage, useIntl } from "react-intl";
import PagesList from '../../components/pages/pagesList';
import BookBanner from '../../components/books/bookBanner';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { libraryService } from '../../services';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import BookEditor from "../../components/books/bookEditor";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import LayersIcon from '@material-ui/icons/Layers';
import { AppBar, Button, Toolbar, Typography } from '@material-ui/core';

const PagesPage = () => {
	const { bookId } = useParams();
	const [book, setBook] = useState(null);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [showEditor, setShowEditor] = useState(false);

	const loadData = () => {
		libraryService.getBook(bookId)
			.then(data => setBook(data))
			.catch(() => setError(true))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		loadData();
	}, [bookId]);

	const renderEditLink = () => {
		if (book && book.links && book.links.update) {
			return (<Button onClick={() => setShowEditor(true)} startIcon={<EditOutlinedIcon />}>
				<FormattedMessage id="action.edit" />
			</Button>);
		}
		return null;
	};

	const renderChaptersLink = () => {
		if (book && book.links && book.links.update) {
			return (<Button component={Link} to={`/books/${book.id}/chapters`} startIcon={<LayersIcon />}>
				<FormattedMessage id="chapter.toolbar.chapters" />
			</Button>);
		}
		return null;
	}

	const renderPagesLink = () => {
		if (book && book.links && book.links.update) {
			return (<Button component={Link} to={`/books/${book.id}/pages`} startIcon={<FileCopyIcon />}>
				<FormattedMessage id="pages.label" />
			</Button>);
		}
		return null;
	}

	const handleClose = () => {
		setShowEditor(false);
	};

	const onBookSaved = () => {
		loadData();

		handleClose();
	}

	if (loading) return <Loading />

	if (error) return <ErrorMessage message="Error loading book." />

	if (book == null) return <ErrorMessage message="Book not found" />


	return (<>
		<Toolbar variant='regular'>
			<Typography color="primary">{book && book.title}</Typography>
			{renderEditLink()}
			{renderChaptersLink()}
			{renderPagesLink()}
		</Toolbar>
		<PagesList book={book} />
		<BookEditor
			show={showEditor}
			book={book}
			onSaved={onBookSaved}
			onCancelled={handleClose}
		/>
	</>);
};

export default PagesPage;
