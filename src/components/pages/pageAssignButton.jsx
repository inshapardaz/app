import React, { useCallback } from 'react';
import { FormattedMessage, useIntl } from "react-intl";
import { useSnackbar } from 'notistack';

import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from "@material-ui/core/ListItemIcon";
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';

import { libraryService } from "../../services";

const PageAssignButton = ({ checked, pages, onAssigned }) => {
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();

	const onAssignToMe = useCallback(() => {
		var promises = [];

		checked.map(id => {
			var p = pages.data.find(pg => pg.sequenceNumber == id);
			if (p !== null && p !== undefined) {
				if (p.links.assign_to_me) {
					return promises.push(libraryService.post(p.links.assign_to_me));
				}
			}

			return Promise.resolve();
		});

		Promise.all(promises)
			.then(() => enqueueSnackbar(intl.formatMessage({ id: 'pages.messages.assigned' }), { variant: 'success' }))
			.then(() => onAssigned())
			.catch(() => enqueueSnackbar(intl.formatMessage({ id: 'pages.messages.error.assigned' }), { variant: 'error' }));
	}, [checked, pages]);

	return (
		<MenuItem
			edge="start"
			disabled={checked.length <= 0}
			aria-label="menu"
			onClick={onAssignToMe} >
			<ListItemIcon>
				<AssignmentIndIcon fontSize="small" />
			</ListItemIcon>
			<FormattedMessage id="page.assignedToMe.label" />
		</MenuItem>
	);
};

export default PageAssignButton;
