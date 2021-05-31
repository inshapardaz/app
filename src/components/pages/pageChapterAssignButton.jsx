import React, { useState, useEffect } from "react";

import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import EditorDialog from '../editorDialog';
import LinkIcon from '@material-ui/icons/Link';
import { FormattedMessage } from "react-intl";
import { libraryService } from "../../services";
import AssignList, { ProcessingStatus } from './processingStatusIcon';

function SimpleDialog(props) {
	const [busy, setBusy] = useState(false);
	const { onClose, open, book, selectedPages, onUpdated } = props;
	const [pagesStatus, setPagesStatus] = useState([]);
	const [chapters, setChapters] = useState(null);
	const [selectedChapter, setSelectedChapter] = useState(null);

	useEffect(() => {
		if (selectedPages) {
			setPagesStatus(selectedPages.map(p => ({ sequenceNumber: p.sequenceNumber, assignStatus: ProcessingStatus.Pending })))
		}
	}, [selectedPages]);

	const handleClose = () => {
		if (pagesStatus.filter(x => x.assignStatus === ProcessingStatus.Complete).length > 0 && onUpdated) {
			onUpdated();
		}

		onClose();
	};

	const setPageStatus = (page, status) => {
		var newPages = pagesStatus.map(p => {
			if (p.sequenceNumber === page.sequenceNumber) {
				p.assignStatus = status;
			}

			return p;
		});

		setPagesStatus(newPages);
	}

	const handleListItemClick = (chapterId) => {
		setSelectedChapter(chapters.find(c => c.id = chapterId));
	};

	const handleSubmit = () => {
		var promises = [];
		setBusy(true);
		selectedPages.map(page => {
			if (page !== null && page !== undefined) {
				if (page.links.update) {
					setPageStatus(page, ProcessingStatus.Processing)
					page.chapterId = selectedChapter.id;
					return promises.push(libraryService.put(page.links.update, page)
						.then(() => setPageStatus(page, ProcessingStatus.Complete))
						.catch(() => setPageStatus(page, ProcessingStatus.Error)));
				}
				else {
					setPageStatus(page, ProcessingStatus.Skipped)
				}
			}

			return Promise.resolve();
		});

		Promise.all(promises)
			.then(() => setBusy(false))
			.then(() => {
				if (pagesStatus.filter(p => p.ocrStatus === 'error').length === 0) {
					handleClose();
				}
			})
			.catch(e => console.error(e));
	};

	useEffect(() => {
		libraryService
			.getBookChapters(book)
			.then((response) => {
				setChapters(response.data);
			})
	}, [open]);

	const hasProcessablePages = pagesStatus.filter(x => x.assignStatus === ProcessingStatus.Error || x.assignStatus === ProcessingStatus.Pending).length > 0;


	return (
		<EditorDialog show={open} busy={busy}
			title={<FormattedMessage id="pages.associateWithChapter" />}
			onCancelled={handleClose} >
			<FormControl fullWidth>
				<InputLabel id="chapter-select"><FormattedMessage id="chapter.toolbar.chapters" /></InputLabel>
				<Select
					labelId="chapter-select"
					id="demo-simple-select"
					value={selectedChapter != null ? selectedChapter.id : ''}
					onChange={(e) => handleListItemClick(e.target.value)}
				>
					{chapters != null && chapters.map((chapter) => (
						<MenuItem key={chapter.id} value={chapter.id}>{chapter.title}</MenuItem>))}
				</Select>
			</FormControl>
			<AssignList pages={pagesStatus} />
			<Button aria-controls="get-text" aria-haspopup="false" onClick={handleSubmit}
				disabled={!selectedChapter || !hasProcessablePages}
				startIcon={<LinkIcon />} fullWidth
				variant="contained"
				color="primary">
				<FormattedMessage id="pages.associateWithChapter" />
			</Button>
		</EditorDialog>
	);
}

SimpleDialog.propTypes = {
	onClose: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
};

const PageChapterAssignButton = ({ book, selectedPages, onUpdated }) => {
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Button disabled={selectedPages.length < 1} onClick={handleClickOpen} startIcon={<LinkIcon />}>
				<FormattedMessage id="pages.associateWithChapter" />
			</Button>
			<SimpleDialog open={open} onClose={handleClose} book={book} selectedPages={selectedPages} onUpdated={onUpdated} />
		</>
	);
};

export default PageChapterAssignButton;
