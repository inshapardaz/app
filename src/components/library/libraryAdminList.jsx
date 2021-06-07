import { Button, IconButton, Paper, TableFooter, Toolbar } from '@material-ui/core';
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
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import Pagination from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";
import DeleteLibraryButton from "./DeleteLibraryButton.jsx";
import { libraryService } from '../../services';
import LibraryEditor from './libraryEditor.jsx';

const useStyles = makeStyles((theme) => ({
	root: {
		margin: 8
	},
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


const LibraryAdminList = () => {
	const location = useLocation();
	const classes = useStyles();
	const [libraries, setLibraries] = useState(null);
	const [query, setQuery] = useState(null);
	const [loading, setLoading] = useState(false);
	const [, setError] = useState(false);
	const [showEditor, setShowEditor] = useState(false);
	const [selectedLibrary, setSelectedLibrary] = useState(null);
	const defaultLibrary = libraryService.getSelectedLibrary();

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
				console.dir(data);
			})
			.catch(() => setError(true))
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

	const handleClose = () => {
		setSelectedLibrary(null);
		setShowEditor(false);
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
		<div className={classes.root}>
			<Paper className={classes.paper}>
				<Toolbar>
					<Button variant="contained" color="primary" onClick={() => createLibrary()}><FormattedMessage id="admin.library.add" /></Button>
				</Toolbar>
				<TableContainer >
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
										<DeleteLibraryButton
											library={library}
											onDeleted={handleDataChanged}
											onCancelled={handleClose}
										/>
										{defaultLibrary && defaultLibrary.id == library.id &&
											<IconButton disabled>
												<CheckBoxIcon />
											</IconButton>
										}
										{defaultLibrary && defaultLibrary.id != library.id &&
											<IconButton onClick={() => libraryService.setSelectedLibrary(library)}>
												<CheckBoxOutlineBlankIcon />
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
			</Paper>
		</div>
	);
};

export default LibraryAdminList;
