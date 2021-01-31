import { Button, Container, IconButton, Paper, TableFooter, Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import queryString from "query-string";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import { accountService } from '../../../services';
import PaginationItem from '@material-ui/lab/PaginationItem';
import Pagination from '@material-ui/lab/Pagination';
import DeleteAccount from '../../../components/account/deleteAccount';
import AccountLibraryEditor from '../../../components/account/accountLibraryEditor';
import AccountEditor from '../../../components/account/accountEditor';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		marginBottom: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	table: {
		minWidth: 650
	},
	buttonProgress: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -12,
		marginLeft: -12
	}
}));

const buildLinkToPage = (location, page, query) => {
	let querystring = "";
	querystring += page ? `page=${page}` : "";
	querystring += query ? `query=${query}` : "";
	if (querystring !== "") {
		querystring = `?${querystring}`;
	}
	return `${location.pathname}${querystring}`;
};

const roleMapper = (role) => {
	switch (role) {
		case "0":
			return (<FormattedMessage id="role.administrator" />);
		case "1":
			return <FormattedMessage id="role.libraryAdmin" />;
		case "2":
			return <FormattedMessage id="role.writer" />;
		case "3":
			return <FormattedMessage id="role.reader" />;
		default:
			return "";
	}
};

function List({ match }) {
	const location = useLocation();
	const classes = useStyles();
	const { path } = match;
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [query, setQuery] = useState(null);
	const [users, setUsers] = useState(null);
	const [showEditor, setShowEditor] = useState(false);
	const [showDelete, setShowDelete] = useState(false);
	const [showLibraryEditor, setShowLibraryEditor] = useState(false);
	const [selectedAccount, setSelectedAccount] = useState(null);


	const loadData = () => {
		const values = queryString.parse(location.search);
		const page = values.page;
		const q = values.q;

		setLoading(true);

		accountService.getAll(q ? q : null, page)
			.then((data) => {
				setQuery(q);
				setUsers(data);
			})
			.catch((e) => setError(true))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		loadData();
	}, [location]);

	function createAccount() {
		setSelectedAccount(null);
		setShowEditor(true);
	}

	function editAccountLibraries(account) {
		setSelectedAccount(account);
		setShowLibraryEditor(true);
	}

	function editAccount(account) {
		setSelectedAccount(account);
		setShowEditor(true);
	}

	function deleteAccount(account) {
		setSelectedAccount(account);
		setShowDelete(true);
	}

	const handleClose = () => {
		setSelectedAccount(null);
		setShowLibraryEditor(false);
		setShowEditor(false);
		setShowDelete(false);
	};

	const handleDataChanged = () => {
		handleClose();
		loadData();
	};

	const renderPagination = () => {
		if (!loading && users) {
			return (
				<Pagination
					page={users.currentPageIndex}
					count={users.pageCount}
					variant="outlined"
					shape="rounded"
					renderItem={(item) => (
						<PaginationItem
							component={Link}
							to={buildLinkToPage(
								location,
								item.page,
								query
							)}
							{...item}
						/>
					)}
				/>
			);
		}

		return null;
	};

	return (
		<div className={classes.paper}>
			<Container component="main" maxWidth="md">
				<Typography variant="h2"><FormattedMessage id="admin.users.title" /></Typography>
				<Button variant="contained" color="primary" onClick={() => createAccount()}><FormattedMessage id="admin.users.add" /></Button>
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
							{users && users.data && users.data.map(user =>
								<TableRow key={user.id}>
									<TableCell>{user.title} {user.firstName} {user.lastName}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>{roleMapper(user.role)}</TableCell>
									<TableCell style={{ whiteSpace: 'nowrap' }}>
										<IconButton onClick={() => editAccountLibraries(user)}>
											<LocalLibraryIcon />
										</IconButton>
										<IconButton onClick={() => editAccount(user)}>
											<EditIcon />
										</IconButton>
										<IconButton onClick={() => deleteAccount(user)}>
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
						<TableFooter>
							<TableRow>
								<TableCell colSpan={4}>
									{renderPagination()}
								</TableCell>
							</TableRow>
						</TableFooter>
					</Table>
				</TableContainer>
				<AccountLibraryEditor
					show={showLibraryEditor}
					account={selectedAccount}
					onCancelled={handleClose}
				/>
				<AccountEditor
					show={showEditor}
					account={selectedAccount}
					createLink={users && users.links.create}
					onSaved={handleDataChanged}
					onCancelled={handleClose}
				/>
				<DeleteAccount
					show={showDelete}
					account={selectedAccount}
					onDeleted={handleDataChanged}
					onCancelled={handleClose}
				/>
			</Container>
		</div>
	);
}

export { List };
