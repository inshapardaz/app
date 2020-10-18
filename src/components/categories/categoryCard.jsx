import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import { makeStyles } from '@material-ui/core/styles';

const defaultCategoryImage = '/resources/img/auhtor_placeholder.png';

const CategoryCard = ({ category, onEdit, onDelete }) =>
{
	const classes = makeStyles(() => ({
		root : {
			maxWidth : 345
		}
	}));

	const renderEditLink = () =>
	{
		if (category.links.update)
		{
			return (
				<IconButton onClick={() => onEdit(category)}>
					<EditOutlinedIcon />
				</IconButton>);
		}
		return null;
	};

	const renderDeleteLink = () =>
	{
		if (category.links.delete)
		{
			return (
				<IconButton onClick={() => onDelete(category)}>
					<DeleteForeverOutlinedIcon />
				</IconButton>
			);
		}
		return null;
	};

	return (
		<Card className={classes.root} key={category.id}>
			<CardActionArea component={Link} to={`/categories/${category.id}`}>
				<CardContent>
					<Typography gutterBottom variant="h5" component="h2">
						{category.name}
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						<FormattedMessage id="categories.item.book.count" values={{ count : category.bookCount }} />
					</Typography>
				</CardContent>
			</CardActionArea>
			<CardActions>
				{renderEditLink()}
				{renderDeleteLink()}
				<IconButton component={Link} to={`/books?category=${category.id}`}>
					<MenuBookIcon />
				</IconButton>
			</CardActions>
		</Card>);
};

export default CategoryCard;
