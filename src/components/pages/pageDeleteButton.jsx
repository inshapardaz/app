import React, { useCallback } from 'react';
import { FormattedMessage, useIntl } from "react-intl";
import { useConfirm } from 'material-ui-confirm';
import { useSnackbar } from 'notistack';

import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DeleteIcon from '@material-ui/icons/Delete';

import { libraryService } from "../../services";

const PageDeleteButton = ({ checked, pages, onDeleted }) => {
	const confirm = useConfirm();
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();

	const onDeleteMultipleClicked = useCallback(() => {
		console.log(checked);
		confirm({
			title: intl.formatMessage({ id: "action.delete" }),
			description: intl.formatMessage({ id: "page.action.confirmDeleteMultiple" }, { count: checked.length }),
			confirmationText: intl.formatMessage({ id: "action.yes" }),
			cancellationText: intl.formatMessage({ id: "action.no" }),
			confirmationButtonProps: { variant: "contained", color: "secondary" },
			cancellationButtonProps: { color: "secondary" }
		})
			.then(() => {
				var promises = [];

				checked.map(id => {
					var page = pages.data.find(p => p.sequenceNumber == id);
					if (page && page.links && page.links.delete) {
						return promises.push(libraryService.delete(page.links.delete));
					}
					else {
						return Promise.resolve();
					}
				});

				Promise.all(promises)
					.then(() => enqueueSnackbar(intl.formatMessage({ id: 'page.messages.deleted' }), { variant: 'success' }))
					.then(() => onDeleted())
					.catch(() => enqueueSnackbar(intl.formatMessage({ id: 'page.messages.error.delete' }), { variant: 'error' }));
			}).catch(() => { })
	}, [checked, pages]);

	return (
		<MenuItem
			edge="start"
			color="inherit"
			disabled={checked.length <= 0}
			aria-label="menu"
			variant="text"
			onClick={onDeleteMultipleClicked}>
			<ListItemIcon>
				<DeleteIcon fontSize="small" />
			</ListItemIcon>
			<FormattedMessage id="action.delete" />
		</MenuItem>
	);
};

export default PageDeleteButton;
