import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { FormattedMessage } from 'react-intl';

import CategoriesBanner from './categoriesBanner.jsx';
import LibraryService from '../../services/LibraryService';
import CategoryCard from './categoryCard.jsx';
import CategoryEditor from './categoryEditor.jsx';
import DeleteCategory from './deleteCategory.jsx';

const useStyles = makeStyles({
	cellGrid : {
		padding : 60
	}
});

const CategoriesPage = () =>
{
	const classes = useStyles();
	const [showEditor, setShowEditor] = useState(false);
	const [showDelete, setShowDelete] = useState(false);
	const [categories, setCategories] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const [isError, setError] = useState(false);

	const loadData = async () =>
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

	useEffect(() =>
	{
		loadData();
	}, []);

	const handleClose = () =>
	{
		setSelectedCategory(null);
		setShowEditor(false);
		setShowDelete(false);
	};

	const onDeleteClicked = useCallback(category =>
	{
		setSelectedCategory(category);
		setShowDelete(true);
	}, [categories]);

	const onEditClicked = useCallback(category =>
	{
		setSelectedCategory(category);
		setShowEditor(true);
	}, [categories]);

	const handleDataChanged = () =>
	{
		handleClose();
		loadData();
	};

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

		const renderCategory = (c) => (
			<Grid item key={c.id} spacing={4} xs={12} sm={16} md={13} lg={12}>
				<CategoryCard key={c.id} category={c} onEdit={onEditClicked} onDelete={onDeleteClicked} />
			</Grid>);

		return (<Grid className={classes.cellGrid} container spacing={4}>{categories.data.map(renderCategory) }
		</Grid>);
	};

	return (<>
			<CategoriesBanner title={<FormattedMessage id="header.categories" />}
				createLink={categories && categories.links.create} onCreate={() => onEditClicked(null)} />
			<Grid container spacing={3}>
				{renderCategories()}
			</Grid>
			<CategoryEditor show={showEditor}
				category={selectedCategory}
				createLink={categories && categories.links.create}
				onSaved={handleDataChanged}
				onCancelled={handleClose} />
			<DeleteCategory show={showDelete}
				category={selectedCategory}
				onDeleted={handleDataChanged}
				onCancelled={handleClose} />
	</>);
};

export default CategoriesPage;
