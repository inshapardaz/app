import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { libraryService } from '../../services';

const ChapterDropdown = ({ bookId, title, onChapterSelected, navigate }) => {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [chapters, setChapters] = useState(null);

	const loadChapters = () => {
		libraryService.getChapters(bookId)
			.then(response => {
				setChapters(response.data);
			})
			.catch(() => setError(true))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		loadChapters();
	}, [bookId]);

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
			return (<MenuItem key={chapter.id} onClick={handleClose} component={Link} to={`/books/${chapter.bookId}/chapter/${chapter.chapterNumber}`}>{chapter.title}</MenuItem>);
		}

		return (<MenuItem key={chapter.id} onClick={() => onItemClicked(chapter)}>{chapter.title}</MenuItem>);
	}

	return (
		<div>
			<Button aria-controls="chapters-menu" aria-haspopup="true" onClick={handleClick} endIcon={<ExpandMoreIcon />}>
				{title}
			</Button>
			<Menu
				id="simple-menu"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
			> {chapters && chapters.map(c => renderMenuItem(c))}
			</Menu>
		</div>
	);

}

export default ChapterDropdown;
