import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { LinearProgress } from '@material-ui/core';
import { FormattedMessage, useIntl } from 'react-intl';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(() => ({
	progressBar: {
		marginTop: '8px',
		marginBottom: '8px',
		marginLeft: '4px',
		marginRight: '4px',
	}
}));

const BookPageProgress = ({ book }) => {
	const classes = useStyles();

	if (book != null) {
		return (
			<>
				<Typography variant="caption" display="block" gutterBottom>
					<FormattedMessage id={`book.status.${book.status}`} />
				</Typography>
				<LinearProgress value={book.progress} variant="determinate" color="secondary" className={classes.progressBar} />
			</>);
	}
	return "";
}
export default BookPageProgress;
