import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSnackbar } from 'notistack';
import { FormattedMessage, useIntl } from "react-intl";
import { useConfirm } from 'material-ui-confirm';

import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Pagination from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from "@material-ui/icons/AddCircle";

import { libraryService } from "../../services";
import BookCard from "./bookCard.jsx";
import BookEditor from "./bookEditor.jsx";
import BookPopup from "./bookPopup";
import { Button } from "@material-ui/core";

const useStyles = () =>
	makeStyles((theme) => ({
		cardGrid: {
			paddingTop: theme.spacing(8),
			paddingBottom: theme.spacing(8),
		},
	}));
const classes = useStyles();

// eslint-disable-next-line max-params
const buildLinkToPage = (page, authorId, categoryId, seriesId, query, appendExtraParams = false) => {
	const location = useLocation();

	let querystring = "";
	querystring += page ? `page=${page}&` : "";
	querystring += query ? `query=${query}&` : "";
	if (appendExtraParams) {
		querystring += authorId ? `author=${authorId}` : "";
		querystring += categoryId ? `category=${categoryId}` : "";
		querystring += seriesId ? `series=${seriesId}` : "";
		queryString += sortBy ? `sortBy=${sortBy}&` : "";
	}
	if (querystring !== "") {
		querystring = `?${querystring}`.slice(0, -1);
	}
	return `${location.pathname}${querystring}`;
};

const BookList = ({ page, query, categoryId, authorId, seriesId, sortBy = null }) => {
	const confirm = useConfirm();
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();
	const [showPopup, setShowPopup] = useState(false);
	const [showEditor, setShowEditor] = useState(false);
	const [selectedBook, setSelectedBook] = useState(null);
	const [books, setBooks] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const [isError, setError] = useState(false);

	const loadData = () => {
		setLoading(true);
		libraryService
			.getBooks(
				authorId ? authorId : null,
				categoryId ? categoryId : null,
				seriesId ? seriesId : null,
				query ? query : null,
				page,
				sortBy ? sortBy : null,
			)
			.then((data) => {
				setBooks(data);
			})
			.catch((e) => setError(true))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		loadData();
	}, [page, query, categoryId, authorId, seriesId]);

	const handleClose = () => {
		setSelectedBook(null);
		setShowPopup(false);
		setShowEditor(false);
	};

	const onDeleteClicked = useCallback(
		(book) => {
			confirm({
				title: intl.formatMessage({ id: "action.delete" }),
				description: intl.formatMessage({ id: "books.action.confirmDelete" }, { title: book.title }),
				confirmationText: intl.formatMessage({ id: "action.yes" }),
				cancellationText: intl.formatMessage({ id: "action.no" }),
				confirmationButtonProps: { variant: "contained", color: "secondary" },
				cancellationButtonProps: { color: "secondary" }
			})
				.then(() => {
					return libraryService.delete(book.links.delete)
						.then(() => enqueueSnackbar(intl.formatMessage({ id: 'books.messages.deleted' }), { variant: 'success' }))
						.then(() => loadData())
						.catch(() => enqueueSnackbar(intl.formatMessage({ id: 'books.messages.error.delete' }), { variant: 'error' }));
				}).catch(() => { })

		},
		[books]
	);


	const onOpenBook = useCallback(
		(book) => {
			setSelectedBook(book);
			setShowPopup(true);
		},
		[books]
	);

	const onEditClicked = useCallback(
		(book) => {
			setSelectedBook(book);
			setShowEditor(true);
		},
		[books]
	);

	const handleDataChanged = () => {
		handleClose();
		loadData();
	};

	const renderBooks = () => {
		if (isLoading) {
			return <CircularProgress />;
		}

		if (isError) {
			return (
				<Typography variant="h6" component="h6" align="center">
					<FormattedMessage id="books.messages.error.loading" />
				</Typography>
			);
		}

		if (books === null || books.data === null || books.data.length < 1) {
			return (
				<Typography variant="h6" component="h6" align="center">
					<FormattedMessage id="books.messages.empty" />
				</Typography>
			);
		}

		return (
			<Grid container spacing={4}>
				{books.data.map((b) => (
					<Grid item key={b.id} xs={12} sm={6} md={4}>
						<BookCard
							book={b}
							key={b.id}
							onOpen={onOpenBook}
							onEdit={onEditClicked}
							onDelete={onDeleteClicked}
							onUpdated={handleDataChanged}
						/>
					</Grid>
				))}
			</Grid>
		);
	};

	const renderPagination = () => {
		if (!isLoading && books) {
			return (
				<Box mt={8} mb={8}>
					<Pagination
						page={books.currentPageIndex}
						count={books.pageCount}
						variant="outlined"
						shape="rounded"
						renderItem={(item) => (
							<PaginationItem
								component={Link}
								to={buildLinkToPage(
									item.page,
									authorId,
									categoryId,
									seriesId,
									query
								)}
								{...item}
							/>
						)}
					/>
				</Box>
			);
		}

		return null;
	};

	const renderToolBar = () => {
		if (books && books.links.create) {
			return (
				<Toolbar>
					<Button
						variant="contained"
						color="primary"
						aria-label="menu"
						onClick={() => onEditClicked(null)}
						startIcon={<AddCircleIcon />}
					>
						<FormattedMessage id="books.action.create" />
					</Button>
				</Toolbar>
			);
		}

		return null;
	};

	return (
		<Container className={classes.cardGrid} maxWidth="md">
			{renderToolBar()}
			{renderBooks()}
			{renderPagination()}
			<BookPopup
				show={showPopup}
				book={selectedBook}
				createLink={books && books.links.create}
				onClosed={handleClose}
			/>
			<BookEditor
				show={showEditor}
				book={selectedBook}
				createLink={books && books.links.create}
				onSaved={handleDataChanged}
				onCancelled={handleClose}
			/>
		</Container>
	);
};

export default BookList;
