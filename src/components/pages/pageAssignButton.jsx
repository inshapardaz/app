import React, { useCallback } from 'react';
import { FormattedMessage, useIntl } from "react-intl";
import { useSnackbar } from 'notistack';
import Button from '@material-ui/core/Button';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';

import { libraryService } from "../../services";
import { IconButton, Tooltip } from '@material-ui/core';

const PageAssignButton = ({ selectedPages, onAssigned, showText = true }) => {
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();

	const onAssignToMe = useCallback(() => {
		var promises = [];

		selectedPages.map(page => {
			if (page !== null && page !== undefined) {
				if (page.links.assign_to_me) {
					return promises.push(libraryService.post(page.links.assign_to_me));
				}
			}

			return Promise.resolve();
		});

		Promise.all(promises)
			.then(() => enqueueSnackbar(intl.formatMessage({ id: 'pages.messages.assigned' }), { variant: 'success' }))
			.then(() => onAssigned && onAssigned())
			.catch(e => console.error(e))
			.catch(() => enqueueSnackbar(intl.formatMessage({ id: 'pages.messages.error.assigned' }), { variant: 'error' }));
	}, [selectedPages]);

	var button = showText ? (<Button disabled={selectedPages.length <= 0} onClick={onAssignToMe} startIcon={<AssignmentIndIcon />}>
		<FormattedMessage id="page.assignedToMe.label" />
	</Button>)
		: (<IconButton disabled={selectedPages.length <= 0}
			onClick={onAssignToMe} >
			<AssignmentIndIcon />
		</IconButton>)

	return (
		<Tooltip title={<FormattedMessage id="page.assignedToMe.label" />}>
			<span>
				{button}
			</span>
		</Tooltip>
	);
};

export default PageAssignButton;
