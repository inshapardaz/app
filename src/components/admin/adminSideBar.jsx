import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Link } from 'react-router-dom';
import PersonIcon from '@material-ui/icons/Person';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import { useIntl } from 'react-intl';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		maxWidth: 360,
		backgroundColor: theme.palette.background.paper,
	},
}));

function ListItemLink(props) {
	return <ListItem component={Link} {...props} />;
}

const AdminSidebar = () => {
	const classes = useStyles();
	const intl = useIntl();

	return (<div className={classes.root}>
		<List component="nav" aria-label="admin">
			<ListItem button component={Link} to={`/admin/users`}>
				<ListItemIcon>
					<PersonIcon />
				</ListItemIcon>
				<ListItemText primary={intl.formatMessage({ id: `admin.users.title` })} />
			</ListItem>
			<ListItem button component={Link} to={`/admin/libraries`}>
				<ListItemIcon>
					<LocalLibraryIcon />
				</ListItemIcon>
				<ListItemText primary={intl.formatMessage({ id: `admin.libraries.title` })} />
			</ListItem>
		</List>
	</div>);
};

export default AdminSidebar;
