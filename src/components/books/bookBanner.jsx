import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage, useIntl } from "react-intl";

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import LayersIcon from '@material-ui/icons/Layers';
import BookEditor from "./bookEditor.jsx";

const useStyles = makeStyles({
	banner: {
		backgroundImage: props => props.background ? `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url("${props.background}")` :
			'linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url("/images/book_background.jpg")',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		minHeight: 35,
		padding: 50,
		margin: '0 auto'
	},
	bannerTitle: {
		textAlign: 'center',
		fontSize: 40,
		color: '#fff'
	},
	bannerAction: {
		textAlign: 'center',
		paddingTop: 20
	}
});

const BookBanner = ({ book, onUpdate }) => {
	if (book == null) return null;
	const [showEditor, setShowEditor] = useState(false);
	const classes = useStyles({ background: book.links.image });
	console.log(book.links.image);
	const renderAction = () => {

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

		return (<div className={classes.bannerAction}>
			<ButtonGroup variant="contained" color="primary" >
				{renderEditLink()}
				{renderChaptersLink()}
				{renderPagesLink()}
			</ButtonGroup>
		</div >);
	}

	const handleClose = () => {
		setShowEditor(false);
	};

	const onBookSaved = () => {
		if (onUpdate) {
			onUpdate();
		}

		handleClose();
	}

	return (
		<div className={classes.banner}>
			<div className={classes.bannerTitle}>{book.title}</div>
			{renderAction()}
			<BookEditor
				show={showEditor}
				book={book}
				onSaved={onBookSaved}
				onCancelled={handleClose}
			/>
		</div>
	);
};

export default BookBanner;
