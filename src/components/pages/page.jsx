import React, { useCallback } from 'react';
import { FormattedMessage, intl } from "react-intl";

import Checkbox from '@material-ui/core/Checkbox';
import IconButton from "@material-ui/core/IconButton";
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import DescriptionIcon from '@material-ui/icons/Description';
import DeleteIcon from '@material-ui/icons/Delete';

const Page = ({ page, onChecked, onClicked, onEdit, onDeleted }) => {
	const onDeleteClicked = useCallback(
		(page) => {
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

		},
		[page]
	);
	return (
		<GridListTile key={page.sequenceNumber} >
			<img src={page.links.image != null ? page.links.image : "/images/no_image.png"} alt={page.sequenceNumber} />
			<GridListTileBar
				title={page.sequenceNumber}
				subtitle={page.accountId && (<FormattedMessage id="page.assignedTo.label" values={{ name: page.accountName }} />)}
				actionIcon={
					<>
						<IconButton edge="end" aria-label="edit" onClick={onEdit}>
							<DescriptionIcon style={{ color: "white" }} />
						</IconButton>
						<IconButton edge="end" aria-label="delete" onClick={() => onDeleteClicked(page)}>
							<DeleteIcon style={{ color: "white" }} />
						</IconButton>
						<Checkbox
							edge="start"
							checked={onChecked}
							onClick={onClicked}
							tabIndex={-1}
							disableRipple
						/>
					</>
				}
			/>
		</GridListTile >
	);
};

export default Page;
