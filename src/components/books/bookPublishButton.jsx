import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useSnackbar } from 'notistack';
import BookIcon from '@material-ui/icons/Book';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { libraryService } from "../../services";
import Loading from '../Loading';

const BookPublishButton = ({ book }) => {
	const intl = useIntl();
	const [busy, setBusy] = useState(false);
	const { enqueueSnackbar } = useSnackbar();

	const onClick = () => {
		setBusy(true);

		libraryService.post(book.links.publish)
			.then((res) => enqueueSnackbar(intl.formatMessage({ id: 'book.messages.published' }), { variant: 'success' }))
			.catch(() => enqueueSnackbar(intl.formatMessage({ id: 'book.messages.error.publishing' }), { variant: 'error' }))
			.finally(() => setBusy(false));
	}

	if (book && book.links && book.links.publish) {
		return (
			<>
				<ListItem button onClick={onClick}>
					<ListItemIcon>
						<BookIcon />
					</ListItemIcon>
					<ListItemText primary={intl.formatMessage({ id: 'book.action.publish' })} />
				</ListItem>
				{busy && <Loading />}
			</>);
	}
	return null;
}

export default BookPublishButton;
