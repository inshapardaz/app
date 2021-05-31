import React from 'react';
import { useIntl } from 'react-intl';
import GetAppIcon from '@material-ui/icons/GetApp';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { libraryService } from "../../services";

const BookDownloadButton = ({ book }) => {
	const intl = useIntl();

	const onClick = () => {
		libraryService.download(book.links.download)
			.then(blob => {
				const url = window.URL.createObjectURL(new Blob([blob], { type: 'text/plain', name: `${book.title.txt}` }));
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', `${book.title}.txt`);
				document.body.appendChild(link);
				link.click();
				link.parentNode.removeChild(link);
			});
	}
	if (book && book.links && book.links.download) {
		return (<ListItem button onClick={onClick}>
			<ListItemIcon>
				<GetAppIcon />
			</ListItemIcon>
			<ListItemText primary={intl.formatMessage({ id: `action.download` })} />
		</ListItem>);
	}
	return null;
}

export default BookDownloadButton;
