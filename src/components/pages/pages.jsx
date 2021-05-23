import React, { useCallback } from 'react';
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory, Link } from "react-router-dom";

import { useConfirm } from 'material-ui-confirm';
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from "@material-ui/core/IconButton";
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Tooltip from '@material-ui/core/Tooltip';
import DescriptionIcon from '@material-ui/icons/Description';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Toolbar } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	gridListTileBar: {
		height: 36,
		backgroundColor: 'rgba(0,0,0,0.3)'
	},
	gridListTileBarBottom: {
		height: 36,
		backgroundColor: 'rgba(0,0,0,0.3)'
	}
}));

const Pages = ({ book, pages, checkedPages, onClicked, onCheckedChanged, onEdit, onDeleted }) => {
	const intl = useIntl();
	const classes = useStyles();
	const history = useHistory();
	const confirm = useConfirm();
	const [checked, setChecked] = React.useState(checkedPages);

	const onDeleteClicked = useCallback((page) => {
		confirm({
			title: intl.formatMessage({ id: "action.delete" }),
			description: intl.formatMessage({ id: "page.action.confirmDelete" }, { sequenceNumber: page.sequenceNumber }),
			confirmationText: intl.formatMessage({ id: "action.yes" }),
			cancellationText: intl.formatMessage({ id: "action.no" }),
			confirmationButtonProps: { variant: "contained", color: "secondary" },
			cancellationButtonProps: { color: "secondary" }
		})
			.then(() => {
				return libraryService.delete(page.links.delete)
					.then(() => enqueueSnackbar(intl.formatMessage({ id: 'page.messages.deleted' }), { variant: 'success' }))
					.then(() => onDeleted && onDeleted())
					.catch(() => enqueueSnackbar(intl.formatMessage({ id: 'page.messages.error.delete' }), { variant: 'error' }));
			}).catch(() => { })
	}, [pages]);

	const handleToggle = (value) => {
		const currentIndex = checked.indexOf(value);
		const newChecked = [...checked];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		setChecked(newChecked);
		onCheckedChanged && onCheckedChanged(newChecked);
	};

	const handleCheckedChanged = (event, page) => {
		console.log(`changing checked for ${page.sequenceNumber} to ${event.target.checked}`);
		if (event.target.checked) {
			handleToggle(page.sequenceNumber)
		}
		else {
			handleToggle(page.sequenceNumber)
		}
	}



	return (
		<GridList cellHeight={280} cols={4}>
			{pages.data.map((page) => (
				<GridListTile key={page.sequenceNumber} >
					<img src={page.links.image != null ? page.links.image : "/images/no_image.png"} alt={page.sequenceNumber} />
					<GridListTileBar titlePosition="top" title={page.sequenceNumber}
						className={classes.gridListTileBar}
						actionIcon={<Checkbox
							edge="start"
							checked={checked.indexOf(page.sequenceNumber) >= 0}
							onChange={(e) => handleCheckedChanged(e, page)}
							tabIndex={-1}
							disableRipple
						/>} />
					<GridListTileBar subtitle={page.accountId && page.accountName} className={classes.gridListTileBarBottom}
						actionIcon={
							<Toolbar variant="dense">
								<Tooltip title={<FormattedMessage id="action.edit" />} >
									<IconButton edge="end" aria-label="edit" onClick={() => onEdit(page)}>
										<EditIcon style={{ color: "white" }} fontSize="small" />
									</IconButton>
								</Tooltip>
								<Tooltip title={<FormattedMessage id="action.delete" />} >
									<IconButton edge="end" aria-label="delete" onClick={() => onDeleteClicked(page)}>
										<DeleteIcon style={{ color: "white" }} fontSize="small" />
									</IconButton>
								</Tooltip>
								<Tooltip title={<FormattedMessage id="action.editContent" />} >
									<IconButton component={Link} edge="end" aria-label="edit" to={`/books/${book.id}/pages/${page.sequenceNumber}/editor`}>
										<DescriptionIcon style={{ color: "white" }} fontSize="small" />
									</IconButton>
								</Tooltip>
							</Toolbar>
						}
					/>
				</GridListTile >))}
		</GridList>
	);
};

export default Pages;
