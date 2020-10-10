import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { FormattedMessage } from 'react-intl';

import LibraryService from '../../services/LibraryService';
import BookCard from './bookCard.jsx';

const useStyles = () => makeStyles((theme) => ({
	cardGrid : {
	  paddingTop : theme.spacing(8),
	  paddingBottom : theme.spacing(8)
	}
}));
const classes = useStyles();

const NewBookWidget = () =>
{
	const [books, setBooks] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const [isError, setError] = useState(false);

	useEffect(() =>
	{
		const fetchData = async () =>
		{
			try
			{
				const data = await LibraryService.getLatestBooks();
				setBooks(data);
			}
			catch (e)
			{
				console.dir(e);
				setError(true);
			}
			finally
			{
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const renderBooks = () =>
	{
		if (isLoading)
		{
			return (<CircularProgress />);
		}

		if (isError)
		{
			return (<Typography variant="h6" component="h6" align="center">
				<FormattedMessage id="books.messages.error.loading" />
			</Typography>);
		}

		if (books === null || books.data === null || books.data.length < 1)
		{
			return (<Typography variant="h6" component="h6" align="center">
				<FormattedMessage id="books.messages.empty" />
			</Typography>);
		}

		return (<Grid container spacing={4}>{books.data.map((b) => (
			<Grid item key={b.id} xs={12} sm={6} md={4}>
				<BookCard book={b} key={b.id}/>
			</Grid>)) }
		</Grid>);
	};

	return (<>
		<Container className={classes.cardGrid} maxWidth="md">
			{renderBooks()}
		</Container>
	</>);
};

export default NewBookWidget;
