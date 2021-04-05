import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import TextField from '@material-ui/core/TextField';
import { blue } from '@material-ui/core/colors';
import { libraryService } from "../../services";

const emails = ['username@gmail.com', 'user02@gmail.com'];
const useStyles = makeStyles({
	avatar: {
		backgroundColor: blue[100],
		color: blue[600],
	},
});

const LibrarySelectDialog = ({ onClose, open, onLibrarySelected }) => {
	const classes = useStyles();
	const [libraries, setLibraries] = useState(null);
	const [query, setQuery] = useState(null);
	const [loading, setLoading] = useState(false);
	const [, setError] = useState(false);

	const handleClose = () => {
		onClose();
	};

	const handleListItemClick = (value) => {
		onLibrarySelected(value);
	};

	const loadData = () => {
		setLoading(true);
		libraryService
			.getLibraries(
				query ? query : null,
				true
			)
			.then((data) => {
				setLibraries(data);
			})
			.catch(() => setError(true))
			.finally(() => setLoading(false));
	};
	useEffect(() => {
		loadData();
	}, [query]);

	return (
		<Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
			<DialogTitle id="simple-dialog-title">Select Library</DialogTitle>
			<TextField value={query || ''} onChange={e => setQuery(e.target.value)}></TextField>
			<List>
				{libraries && libraries.data && libraries.data.map((library) => (
					<ListItem button onClick={() => handleListItemClick(library)} key={library.id}>
						<ListItemAvatar>
							<Avatar className={classes.avatar}>
								<PersonIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary={library.name} />
					</ListItem>
				))}
			</List>
		</Dialog>
	);
}

export default LibrarySelectDialog;
