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
import Checkbox from '@material-ui/core/Checkbox';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';
import Pagination from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";
import LibraryEditor from "../../../components/library/libraryEditor.jsx";
import DeleteLibrary from "../../../components/library/deleteLibrary.jsx";
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

const buildLinkToPage = (location, page, query) => {
	let querystring = "";
	querystring += page ? `page=${page}` : "";
	querystring += query ? `query=${query}` : "";
	if (querystring !== "") {
		querystring = `?${querystring}`;
	}
	return `${location.pathname}${querystring}`;
};


function List({ match }) {
	const location = useLocation();
	const classes = useStyles();
	const { path } = match;
	const [libraries, setLibraries] = useState(null);
	const [query, setQuery] = useState(null);
	const [loading, setLoading] = useState(false);
	const [showEditor, setShowEditor] = useState(false);
	const [showDelete, setShowDelete] = useState(false);
	const [selectedLibrary, setSelectedLibrary] = useState(null);

	const loadData = () => {
		const values = queryString.parse(location.search);
		const page = values.page;
		const q = values.q;

		setLoading(true);
		libraryService
			.getLibraries(
				q ? q : null,
				page
			)
			.then((data) => {
				setQuery(q);
				setLibraries(data);
			})
			.catch((e) => setError(true))
			.finally(() => setLoading(false));
	};
	useEffect(() => {
		loadData();
	}, [location]);

	function createLibrary() {
		setSelectedLibrary(null);
		setShowEditor(true);
	}
	function editLibrary(library) {
		setSelectedLibrary(library);
		setShowEditor(true);
	}
	function deleteLibrary(library) {
		setSelectedLibrary(library);
		setShowDelete(true);
	}

	const handleClose = () => {
		setSelectedLibrary(null);
		setShowEditor(false);
		setShowDelete(false);
	};

	const handleDataChanged = () => {
		handleClose();
		loadData();
	};

	const renderPagination = () => {
		if (!loading && libraries) {
			return (
				<Pagination
					page={libraries.currentPageIndex}
					count={libraries.pageCount}
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
				<Typography variant="h2"><FormattedMessage id="admin.libraries.title" /></Typography>
				<Button variant="contained" color="primary" onClick={() => createLibrary()}><FormattedMessage id="admin.library.add" /></Button>
				<TableContainer component={Paper}>
					<Table className={classes.table}>
						<TableHead>
							<TableRow>
								<TableCell style={{ width: '30%' }}><FormattedMessage id="library.name.label" /></TableCell>
								<TableCell style={{ width: '30%' }}><FormattedMessage id="library.language.label" /></TableCell>
								<TableCell style={{ width: '30%' }}><FormattedMessage id="library.supportsPeriodical.label" /></TableCell>
								<TableCell style={{ width: '10%' }}></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{libraries && libraries.data && libraries.data.map(library =>
								<TableRow key={library.id}>
									<TableCell>{library.name}</TableCell>
									<TableCell>{library.language}</TableCell>
									<TableCell><Checkbox checked={library.supportsPeriodicals} disabled /></TableCell>
									<TableCell style={{ whiteSpace: 'nowrap' }}>
										{library && library.links && library.links.update &&
											<IconButton onClick={() => editLibrary(library)}  >
												<EditIcon />
											</IconButton>
										}
										{library && library.links && library.links.delete &&
											<IconButton onClick={() => deleteLibrary(library)} disabled={library.isDeleting}>
												<DeleteIcon />
											</IconButton>
										}
									</TableCell>
								</TableRow>
							)}
							{loading &&
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
				<LibraryEditor
					show={showEditor}
					library={selectedLibrary}
					createLink={libraries && libraries.links.create}
					onSaved={handleDataChanged}
					onCancelled={handleClose}
				/>
				<DeleteLibrary
					show={showDelete}
					library={selectedLibrary}
					onDeleted={handleDataChanged}
					onCancelled={handleClose}
				/>
			</Container>
		</div >
	);
}

export { List };
