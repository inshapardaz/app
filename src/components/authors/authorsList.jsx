import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { FormattedMessage, useIntl } from "react-intl";
import { useConfirm } from 'material-ui-confirm';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';

import { libraryService } from '../../services';
import AuthorCard from '../../components/authors/authorCard.jsx';
import AuthorEditor from '../../components/authors/authorEditor.jsx';

const useStyles = makeStyles({
	cellGrid: {
		padding: 60
	}
});

const buildLinkToPage = (page, query) => {
	const location = useLocation();

	let querystring = '';
	querystring += page ? `page=${page}` : '';
	querystring += query ? `query=${query}` : '';
	if (querystring !== '') {
		querystring = `?${querystring}`;
	}
	return `${location.pathname}${querystring}`;
};

const AuthorsList = ({ page, query }) => {

	const confirm = useConfirm();
	const classes = useStyles();
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();
	const [showEditor, setShowEditor] = useState(false);
	const [authors, setAuthors] = useState(null);
	const [selectedAuthor, setSelectedAuthor] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const [isError, setError] = useState(false);

	const loadData = () => {
		libraryService.getAuthors(
			query ? query : null,
			page
		)
			.then(data => {
				setAuthors(data);
			})
			.catch(() => setError(true))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		loadData();
	}, [page, query]);

	const handleClose = () => {
		setSelectedAuthor(null);
		setShowEditor(false);
	};

	const onDeleteClicked = useCallback(
		(author) => {
			confirm({
				title: intl.formatMessage({ id: "action.delete" }),
				description: intl.formatMessage({ id: "authors.action.confirmDelete" }, { name: author.name }),
				confirmationText: intl.formatMessage({ id: "action.yes" }),
				cancellationText: intl.formatMessage({ id: "action.no" }),
				confirmationButtonProps: { variant: "contained", color: "secondary" },
				cancellationButtonProps: { color: "secondary" }
			})
				.then(() => {
					return libraryService.delete(author.links.delete)
						.then(() => enqueueSnackbar(intl.formatMessage({ id: 'authors.messages.deleted' }), { variant: 'success' }))
						.then(() => loadData())
						.catch(() => enqueueSnackbar(intl.formatMessage({ id: 'authors.messages.error.delete' }), { variant: 'error' }));
				})
				.catch(() => { })

		},
		[location]
	);

	const onEditClicked = useCallback(author => {
		setSelectedAuthor(author);
		setShowEditor(true);
	}, [location]);

	const handleDataChanged = () => {
		handleClose();
		loadData();
	};


	const renderAuthors = () => {
		if (isLoading) {
			return (<CircularProgress />);
		}

		if (isError) {
			return (<Typography variant="h6" component="h6" align="center">
				<FormattedMessage id="authors.messages.error.loading" />
			</Typography>);
		}

		if (authors === null || authors.data === null || authors.data.length < 1) {
			return (<Typography variant="h6" component="h6" align="center">
				<FormattedMessage id="authors.messages.empty" />
			</Typography>);
		}

		return (<Grid className={classes.cellGrid} container spacing={3}>{authors.data.map(a => (
			<Grid item key={a.id} xs={12} sm={6} md={3} lg={2}>
				<AuthorCard author={a} key={a.id} onEdit={onEditClicked} onDelete={onDeleteClicked} />
			</Grid>))}
		</Grid>);
	};

	const renderPagination = () => {
		if (!isLoading && authors) {
			return (<Box m={8}>
				<Pagination
					page={authors.currentPageIndex}
					count={authors.pageCount}
					variant="outlined" shape="rounded"
					renderItem={(item) => (
						<PaginationItem
							component={Link}
							to={buildLinkToPage(item.page, query)}
							{...item}
						/>
					)}
				/>
			</Box>);
		}
	}

	return (<>
		<Box>
			{renderAuthors()}
		</Box>
		<Box>
			{renderPagination()}
		</Box>
		<AuthorEditor show={showEditor}
			author={selectedAuthor}
			createLink={authors && authors.links.create}
			onSaved={handleDataChanged}
			onCancelled={handleClose} />
	</>);
}

export default AuthorsList;
