import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { FormattedMessage } from 'react-intl';
import { Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import LibraryService from '../../services/LibraryService';

const CategoryListItem = ({ category, selectedCategory }) =>
{
	return (<ListItem key={category.id} button  selected={selectedCategory && Number(selectedCategory) === category.id}>
		<ListItemText primary={<Link to={`/books?category=${category.id}`}>{ category.name }</Link>} />
	</ListItem>);
};

const CategoriesList = () =>
{
	const location = useLocation();
	const [selectedCategory, setSelectedCategory] = useState(true);
	const [categories, setCategories] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const [isError, setError] = useState(false);

	useEffect(() =>
	{
		const values = queryString.parse(location.search);
		setSelectedCategory(values.category);
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
			return (
				<Typography variant="h6" component="h6" align="center">
					<FormattedMessage id="categories.messages.error.loading" />
				</Typography>);
		}

		return (
			<List component="nav" aria-label="main categories">
				{categories.data.map((c) => (
					<CategoryListItem key={c.id} category={c} selectedCategory={selectedCategory}/>
				))}
			</List>
		);
	};

	return renderCategories();
};

export default CategoriesList;
