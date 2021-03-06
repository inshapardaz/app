import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { FormattedMessage } from "react-intl";

import { libraryService } from '../../services';

const ChapterDropdown = ({ bookId, title, chapters, onChapterSelected, navigate }) => {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState(null);

	const loadChapters = () => {
		if (bookId) {
			libraryService.getChapters(bookId)
				.then(response => {
					setData(response.data);
				})
				.catch(() => setError(true))
				.finally(() => setLoading(false));
		}
		else {
			setData(chapters);
		}
	};

	useEffect(() => {
		loadChapters();
	}, [bookId, chapters]);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const onItemClicked = (chapter) => {
		if (chapter !== null && onChapterSelected !== null) {
			onChapterSelected(chapter)
		}
		handleClose();
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const renderMenuItem = (chapter) => {
		if (navigate) {
			return (<MenuItem key={chapter.id} onClick={handleClose} component={Link} to={`/books/${chapter.bookId}/chapter/${chapter.chapterNumber}`}>{`${chapter.chapterNumber} - ${chapter.title}`}</MenuItem>);
		}

		return (<MenuItem key={chapter.id} onClick={() => onItemClicked(chapter)}>{`${chapter.chapterNumber} - ${chapter.title}`}</MenuItem>);
	}

	return (
		<div>
			<Button aria-controls="chapters-menu" aria-haspopup="true" onClick={handleClick} endIcon={<ExpandMoreIcon />}>
				{title || <FormattedMessage id={"chapter.toolbar.chapters"} />}
			</Button>
			<Menu
				id="simple-menu"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
			> {data && data.map(c => renderMenuItem(c))}
			</Menu>
		</div>
	);

}

export default ChapterDropdown;
