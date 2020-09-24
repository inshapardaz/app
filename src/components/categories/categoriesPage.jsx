import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import List  from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import CategoryIcon from '@material-ui/icons/Category';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import { FormattedMessage, useIntl } from 'react-intl';

import LibraryService from '../../services/LibraryService';
import CategoryEditor from './categoryEditor.jsx';
import CategoryDelete from './categoryDelete.jsx';

const useStyles = () => makeStyles((theme) => ({
	cardGrid : {
	  paddingTop : theme.spacing(8),
	  paddingBottom : theme.spacing(8)
	},
	root : {
		maxWidth : 345
	}
}));
const classes = useStyles();

const CategoryCard = ({ category }) =>
{
	const intl = useIntl();
	return (<ListItem key={category.id}>
		<ListItemAvatar>
			<Avatar>
				<CategoryIcon />
			</Avatar>
		</ListItemAvatar>
		<ListItemText primary={category.name} secondary={intl.formatMessage({ id : 'categories.item.book.count' }, { count : category.bookCount })}/>
		<ListItemSecondaryAction>
			{category.links.update && <CategoryEditor category={category} />}
			{category.links.delete && <CategoryDelete category={category} />}
		</ListItemSecondaryAction>
	  </ListItem>);
};

const CategoriesPage = () =>
{
	const [categories, setCategories] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const [isError, setError] = useState(false);

	useEffect(() =>
	{
		const fetchData = async () =>
		{
			try
			{
				const data = await LibraryService.getCategories();
				setCategories(data);
			}
			catch (e)
			{
				setError(true);
			}
			finally
			{
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const renderCategories = () =>
	{
		if (isLoading)
		{
			return (<CircularProgress />);
		}

		if (isError)
		{
			return (<Typography variant="h6" component="h6" align="center">
				<FormattedMessage id="categories.messages.error.loading" />
			</Typography>);
		}

		if (categories === null || categories.data === null || categories.data.length < 1)
		{
			return (<Typography variant="h6" component="h6" align="center">
				<FormattedMessage id="categories.messages.empty" />
			</Typography>);
		}

		return (<Grid container
			direction="column"
			justify="center"
			spacing={4}>{categories.data.map((c) => (
				<CategoryCard key={c.id} category={c} />
			)) }
		</Grid>);
	};

	return (<>
		<Container className={classes.cardGrid} >
			<Typography variant="h2"><FormattedMessage id="header.categories"/></Typography>
			<List >
				{renderCategories()}
			</List >
		</Container>
	</>);
};

export default CategoriesPage;
