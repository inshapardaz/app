import { Button, Container, IconButton, Paper, Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';

import { accountService } from '../../../services';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		marginBottom: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	table: {
		minWidth: 650,
	},
	buttonProgress: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -12,
		marginLeft: -12,
	},
}));

function List({ match }) {
	const classes = useStyles();
	const { path } = match;
	const [users, setUsers] = useState(null);

	useEffect(() => {
		accountService.getAll().then(x => setUsers(x));
	}, []);

	function deleteUser(id) {
		setUsers(users.map(x => {
			if (x.id === id) { x.isDeleting = true; }
			return x;
		}));
		accountService.delete(id).then(() => {
			setUsers(users => users.filter(x => x.id !== id));
		});
	}

	return (
		<div className={classes.paper}>
			<Container component="main" maxWidth="md">
				<Typography variant="h2"><FormattedMessage id="admin.users.title" /></Typography>
				<Button component={Link} variant="contained" color="primary" to={`${path}/add`}><FormattedMessage id="admin.users.add" /></Button>
				<TableContainer component={Paper}>
					<Table className={classes.table}>
						<TableHead>
							<TableRow>
								<TableCell style={{ width: '30%' }}><FormattedMessage id="user.name.label" /></TableCell>
								<TableCell style={{ width: '30%' }}><FormattedMessage id="user.email.label" /></TableCell>
								<TableCell style={{ width: '30%' }}><FormattedMessage id="user.role.label" /></TableCell>
								<TableCell style={{ width: '10%' }}></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{users && users.map(user =>
								<TableRow key={user.id}>
									<TableCell>{user.title} {user.firstName} {user.lastName}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>{user.role}</TableCell>
									<TableCell style={{ whiteSpace: 'nowrap' }}>
										<IconButton component={Link} to={`${path}/edit/${user.id}`} >
											<EditIcon />
										</IconButton>
										<IconButton onClick={() => deleteUser(user.id)} disabled={user.isDeleting}>
											<DeleteIcon />
										</IconButton>
										{user.isDeleting && <CircularProgress size={24} className={classes.buttonProgress} />}
									</TableCell>
								</TableRow>
							)}
							{!users &&
								<TableRow>
									<TableCell colSpan="4" className="text-center">
										<span className="spinner-border spinner-border-lg align-center"></span>
									</TableCell>
								</TableRow>
							}
						</TableBody>
					</Table>
				</TableContainer>
			</Container>
		</div>
	);
}

export { List };
