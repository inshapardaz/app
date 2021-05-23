import React, { useCallback } from 'react';
import { FormattedMessage, useIntl } from "react-intl";
import { useConfirm } from 'material-ui-confirm';
import { useSnackbar } from 'notistack';

import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import { libraryService } from "../../services";

const PageDeleteButton = ({ selectedPages, onDeleted }) => {
	const confirm = useConfirm();
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();

	const onDeleteMultipleClicked = useCallback(() => {
		confirm({
			title: intl.formatMessage({ id: "action.delete" }),
			description: intl.formatMessage({ id: "page.action.confirmDeleteMultiple" }, { count: selectedPages.length }),
			confirmationText: intl.formatMessage({ id: "action.yes" }),
			cancellationText: intl.formatMessage({ id: "action.no" }),
			confirmationButtonProps: { variant: "contained", color: "secondary" },
			cancellationButtonProps: { color: "secondary" }
		})
			.then(() => {
				var promises = [];

				selectedPages.map(page => {
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
	}, [selectedPages]);

	return (
		<Button
			disabled={selectedPages.length <= 0}
			onClick={onDeleteMultipleClicked}
			startIcon={<DeleteIcon />}>
			<FormattedMessage id="action.delete" />
		</Button>
	);
};

export default PageDeleteButton;
