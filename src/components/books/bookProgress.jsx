import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormattedMessage, useIntl } from 'react-intl';
import { Box, LinearProgress, Popover, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	progress: {
		cursor: 'pointer'
	},
	popoverRoot: {
		minWidth: 200
	},
	progressBar: {
		marginTop: '2px',
		marginBottom: '2px',
	}
}));


const BookProgress = ({ book }) => {
	const classes = useStyles();
	const intl = useIntl();
	const [anchorEl, setAnchorEl] = useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const popOver = () => {
		if (book.pageStatus) {
			return (
				<Box p={2} className={classes.popoverRoot}>
					{
						book.pageStatus.map(s => (
							<div key={s.status}>
								<Typography variant="caption" display="block" gutterBottom><FormattedMessage id={`status.${s.status}`} /></Typography>
								<LinearProgress value={s.percentage} variant="determinate" className={classes.progressBar} color={s.status === 'Completed' ? 'primary' : 'secondary'} />
							</div>
						))
					}
				</Box>);
		}

		return (<Box p={2} className={classes.popoverRoot}><Typography component="span"><FormattedMessage id="pages.progress.none" /></Typography></Box >);
	}

	const open = Boolean(anchorEl);

	if (book.status === 'Published') return null;

	return (<>
		<Typography variant="body2" color="textSecondary" component="span" onClick={handleClick} className={classes.progress}>
			{book.pageCount > 0
				? <>
					<FormattedMessage id="pages.progress" values={{
						completed: intl.formatNumber(book.progress, {
							style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 0
						}), count: book.pageCount
					}} />
					<LinearProgress value={book.progress * 100} variant="determinate" />
				</>
				: <FormattedMessage id="pages.progress.none" />
			}
		</Typography>
		<Popover
			id={book.id}
			open={open}
			anchorEl={anchorEl}
			onClose={handleClose}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'left',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'center',
			}}
		>
			{popOver()}
		</Popover></>);
};

export default BookProgress;
