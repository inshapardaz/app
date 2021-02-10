import React, { } from "react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Tooltip from '@material-ui/core/Tooltip';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import NotesIcon from '@material-ui/icons/Notes';
import PageStatusIcon from './pageStatusIcon';

const PageListItem = ({ page, onCheckChanged, checked, onEdit, onDelete }) => {
	return (
		<ListItem key={page.sequenceNumber}>
			<ListItemIcon>
				<Checkbox
					edge="start"
					checked={checked}
					onClick={onCheckChanged}
					tabIndex={-1}
					disableRipple
				/>
				<PageStatusIcon status={page.status} />
			</ListItemIcon>
			<ListItemAvatar>
				<Typography variant="body1" align="center">{page.sequenceNumber}
				</Typography>
			</ListItemAvatar>
			<ListItemText
				primary={page.accountId && (<FormattedMessage id="page.assignedTo.label" values={{ name: page.accountName }} />)}
			/>
			<ListItemSecondaryAction>
				<Tooltip title={<FormattedMessage id="action.editContent" />} >
					<IconButton component={Link} edge="end" aria-label="edit" to={`/books/${page.bookId}/pages/${page.sequenceNumber}/editor`}>
						<NotesIcon />
					</IconButton>
				</Tooltip>
				<Tooltip title={<FormattedMessage id="action.edit" />} >
					<IconButton edge="end" aria-label="edit" onClick={onEdit}>
						<EditIcon />
					</IconButton>
				</Tooltip>
				<Tooltip title={<FormattedMessage id="action.delete" />} >
					<IconButton edge="end" aria-label="delete" onClick={onDelete}>
						<DeleteIcon />
					</IconButton>
				</Tooltip>
			</ListItemSecondaryAction>
		</ListItem>
	);
};


export default PageListItem;
