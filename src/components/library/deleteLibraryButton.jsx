import React, { useCallback } from 'react';
import { FormattedMessage, useIntl } from "react-intl";
import { useConfirm } from 'material-ui-confirm';
import { useSnackbar } from 'notistack';

import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import { libraryService } from "../../services";
import { IconButton, Tooltip } from '@material-ui/core';


function DeleteLibraryButton({ library, onDeleted, onCancelled }) {
	const confirm = useConfirm();
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();

	const onDelete = useCallback(() => {
		confirm({
			title: intl.formatMessage({ id: "action.delete" }),
			description: intl.formatMessage({ id: "library.action.confirmDelete" }, { name: library.name }),
			confirmationText: intl.formatMessage({ id: "action.yes" }),
			cancellationText: intl.formatMessage({ id: "action.no" }),
			confirmationButtonProps: { variant: "contained", color: "secondary" },
			cancellationButtonProps: { color: "secondary" }
		})
			.then(() => {
				libraryService.delete(library.links.delete)
			})
			.then(() => {
				if (onDelete) {
					onDeleted();
				}
			})
			.then(() => enqueueSnackbar(intl.formatMessage({ id: 'library.message.delete.success' }, { name: library.name }), { variant: 'success' }))
			.catch(() => enqueueSnackbar(intl.formatMessage({ id: 'library.message.delete.error' }), { variant: 'error' }));
	}, [library]);

	if (library && library.links && library.links.delete) {
		return (
			<Tooltip title={<FormattedMessage id="action.delete" />} >
				<IconButton
					disabled={library === null}
					onClick={onDelete}>
					<DeleteIcon />
				</IconButton>
			</Tooltip>
		);
	}

	console.dir(library)
	return null;
}

export default DeleteLibraryButton;
