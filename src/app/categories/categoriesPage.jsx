import React, { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { FormattedMessage, useIntl } from "react-intl";
import { useConfirm } from 'material-ui-confirm';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import { libraryService } from '../../services';
import CategoriesBanner from '../../components/categories/categoriesBanner.jsx';
import CategoryCard from '../../components/categories/categoryCard.jsx';
import CategoryEditor from '../../components/categories/categoryEditor.jsx';

const useStyles = makeStyles({
	cellGrid: {
		padding: 60
	}
});

const CategoriesPage = () => {
	const classes = useStyles();
	const confirm = useConfirm();
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();
	const [showEditor, setShowEditor] = useState(false);
	const [categories, setCategories] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const [isError, setError] = useState(false);

	const loadData = () => {
		libraryService.getCategories()
			.then(data => setCategories(data))
			.catch(() => setError(true))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		loadData();
	}, []);

	const handleClose = () => {
		setSelectedCategory(null);
		setShowEditor(false);
	};

	const onDeleteClicked = useCallback(
		(category) => {
			confirm({
				title: intl.formatMessage({ id: "action.delete" }),
				description: intl.formatMessage({ id: "categories.action.confirmDelete" }, { name: category.name }),
				confirmationText: intl.formatMessage({ id: "action.yes" }),
				cancellationText: intl.formatMessage({ id: "action.no" }),
				confirmationButtonProps: { variant: "contained", color: "secondary" },
				cancellationButtonProps: { color: "secondary" }
			})
				.then(() => {
					return libraryService.delete(category.links.delete)
						.then(() => enqueueSnackbar(intl.formatMessage({ id: 'categories.messages.deleted' }), { variant: 'success' }))
						.then(() => loadData())
						.catch(() => enqueueSnackbar(intl.formatMessage({ id: 'categories.messages.error.delete' }), { variant: 'error' }));
				}).catch(() => { })

		},
		[categories]
	);

	const onEditClicked = useCallback(category => {
		setSelectedCategory(category);
		setShowEditor(true);
	}, [categories]);

	const handleDataChanged = () => {
		handleClose();
		loadData();
	};

	const renderCategories = () => {
		if (isLoading) {
			return (<CircularProgress />);
		}

		if (isError) {
			return (<Typography variant="h6" component="h6" align="center">
				<FormattedMessage id="categories.messages.error.loading" />
			</Typography>);
		}

		if (categories === null || categories.data === null || categories.data.length < 1) {
			return (<Typography variant="h6" component="h6" align="center">
				<FormattedMessage id="categories.messages.empty" />
			</Typography>);
		}

		const renderCategory = (c) => (
			<Grid item key={c.id} xs={12} sm={12} md={12} lg={12}>
				<CategoryCard key={c.id} category={c} onEdit={onEditClicked} onDelete={onDeleteClicked} />
			</Grid>);

		return (<Grid className={classes.cellGrid} container spacing={4}>{categories.data.map(renderCategory)}
		</Grid>);
	};

	return (<>
		<CategoriesBanner title={<FormattedMessage id="header.categories" />}
			createLink={categories && categories.links.create} onCreate={() => onEditClicked(null)} />
		<Grid container spacing={4}>
			{renderCategories()}
		</Grid>
		<CategoryEditor show={showEditor}
			category={selectedCategory}
			createLink={categories && categories.links.create}
			onSaved={handleDataChanged}
			onCancelled={handleClose} />
	</>);
};

export default CategoriesPage;
