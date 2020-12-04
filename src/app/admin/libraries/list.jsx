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

import { libraryService } from '../../../services';

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
	const [libraries, setLibraries] = useState(null);

	useEffect(() => {
		libraryService.getLibraries().then(x => setLibraries(x.data));
	}, []);

	function deleteUser(id) {
		setLibraries(libraries.map(x => {
			if (x.id === id) { x.isDeleting = true; }
			return x;
		}));
		libraryService.delete(id).then(() => {
			setLibraries(library => library.filter(x => x.id !== id));
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
								<TableCell style={{ width: '30%' }}>Name</TableCell>
								<TableCell style={{ width: '30%' }}>Email</TableCell>
								<TableCell style={{ width: '30%' }}>Role</TableCell>
								<TableCell style={{ width: '10%' }}></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{libraries && libraries.map(library =>
								<TableRow key={library.id}>
									<TableCell>{library.name}</TableCell>
									<TableCell>{library.language}</TableCell>
									<TableCell>{library.supportsPeriodicals}</TableCell>
									<TableCell style={{ whiteSpace: 'nowrap' }}>
										<IconButton component={Link} to={`${path}/edit/${library.id}`} >
											<EditIcon />
										</IconButton>
										<IconButton onClick={() => deleteUser(library.id)} disabled={library.isDeleting}>
											<DeleteIcon />
										</IconButton>
										{library.isDeleting && <CircularProgress size={24} className={classes.buttonProgress} />}
									</TableCell>
								</TableRow>
							)}
							{!libraries &&
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
