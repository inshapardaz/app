import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { FormattedMessage } from 'react-intl';
import { Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CircularProgress from '@material-ui/core/CircularProgress';
import CategoryIcon from '@material-ui/icons/Category';
import {
	CategoryProvider,
	CategoryTitle,
	CategoryItem,
} from '@mui-treasury/components/menu/category';
import { useNikiCategoryMenuStyles } from '@mui-treasury/styles/categoryMenu/niki';
import { libraryService } from '../../services';

const CategoryListItem = ({ category, selectedCategory }) => {
	const history = useHistory();

	const categoryClicked = useCallback(() => {
		history.push(`/books?category=${category.id}`);
	}, [category]);

	return (<ListItem key={category.id} button divider selected={selectedCategory && Number(selectedCategory) === category.id} onClick={categoryClicked}>
		<ListItemIcon>
			<CategoryIcon />
		</ListItemIcon>
		<ListItemText
			primary={category.name}
			secondary={<FormattedMessage id="categories.item.book.count" values={{ count: category.bookCount }} />} />
	</ListItem>);
};

const CategoriesList = () => {
	const location = useLocation();
	const [selectedCategory, setSelectedCategory] = useState(true);
	const [categories, setCategories] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const [isError, setError] = useState(false);

	useEffect(() => {
		const values = queryString.parse(location.search);
		setSelectedCategory(values.category);
		const fetchData = () => {
			setLoading(true);
			libraryService.getCategories()
				.then(data => setCategories(data))
				.catch(() => setError(true))
				.finally(() => setLoading(false));
		};
		fetchData();
	}, []);

	const renderCategories = () => {
		if (isLoading) {
			return (<CircularProgress />);
		}

		if (isError) {
			return (
				<Typography variant="h6" component="h6" align="center">
					<FormattedMessage id="categories.messages.error.loading" />
				</Typography>);
		}

		// return (<CategoryProvider useStyles={useNikiCategoryMenuStyles}>
		// 	<CategoryTitle><FormattedMessage id="header.categories" /></CategoryTitle>
		// 	{categories.data.map(c => (
		// 		<CategoryItem key={c.id} as={Link} to={`/books?category=${c.id}`}
		// 			active={selectedCategory && Number(selectedCategory) === c.id}>
		// 			{c.name}
		// 		</CategoryItem>
		// 	))}
		// </CategoryProvider >);
		return (
			<List component="nav" aria-label="main categories">
				{categories.data.map((c) => (
					<CategoryListItem key={c.id} category={c} selectedCategory={selectedCategory} />
				))}
			</List>
		);
	};

	return renderCategories();
};

export default CategoriesList;
