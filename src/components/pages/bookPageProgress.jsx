import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { LinearProgress, Tooltip } from '@material-ui/core';
import { FormattedMessage, useIntl } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import BookStatus from '../../models/bookStatus';
import PageStatus from '../../models/pageStatus';

const useStyles = makeStyles(() => ({
	progressBar: {
		marginTop: '8px',
		marginBottom: '8px',
		marginLeft: '4px',
		marginRight: '4px',
	}
}));

const getBookProgress = (book) => {
	let status = null;

	if (!book.pageStatus) return 0;

	switch (book.status) {
		case BookStatus.AvailableForTyping:
			status = PageStatus.AvailableForTyping;
			break;
		case BookStatus.BeingTyped:
			status = book.pageStatus.Typing;
			break;
		case BookStatus.ProofRead:
			status = book.pageStatus.InReview;
			break;
		case BookStatus.Published:
			status = book.pageStatus.Completed;
			break;
		case BookStatus.ReadyForProofRead:
			status = book.pageStatus.Typed;
			break;
	}

	var pageStatus = book.pageStatus.find(s => s.status === status);
	if (pageStatus) {
		return {
			completed: book.pageCount - pageStatus.count,
			percentage: pageStatus.percentage
		};
	}
	return {
		percentage: 0,
		count: 0
	};
}

const BookPageProgress = ({ book }) => {
	const classes = useStyles();

	const pagesProgress = getBookProgress(book);
	if (book != null) {

		return (
			<>
				<Typography variant="caption" display="block" gutterBottom>
					<FormattedMessage id={`book.status.${book.status}`} />|<FormattedMessage id="pages.progress" values={{ count: book.pageCount, completed: pagesProgress.completed }} />
				</Typography>
				<Tooltip title={`${100 - pagesProgress.percentage}%`}>
					<LinearProgress value={100 - pagesProgress.percentage} variant="determinate" color="secondary" className={classes.progressBar} />
				</Tooltip>
			</>);
	}
	return "";
}
export default BookPageProgress;
