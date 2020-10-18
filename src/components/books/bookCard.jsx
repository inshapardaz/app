import React from 'react';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { makeStyles } from '@material-ui/core/styles';

const defaultBookImage = '/resources/img/book_placeholder.png';

function FavoriteButton ({ book })
{
	if (book.links.create_favorite)
	{
		return (
			<IconButton aria-label="add to favorites">
				<FavoriteBorderIcon />
			</IconButton>
		);
	}
	return (
		<IconButton aria-label="add to favorites">
			<FavoriteIcon />
		</IconButton>
	);
}

function BookCell ({ book, onEdit, onDelete })
{
	const classes = makeStyles(() => ({
		root : {
			maxWidth : 345
		}
	}));

	const renderEditLink = () =>
	{
		if (book.links.update)
		{
			return (
				<IconButton onClick={() => onEdit(book)}>
					<EditOutlinedIcon />
				</IconButton>);
		}
		return null;
	};

	const renderDeleteLink = () =>
	{
		if (book.links.delete)
		{
			return (
				<IconButton onClick={() => onDelete(book)}>
					<DeleteForeverOutlinedIcon />
				</IconButton>
			);
		}
		return null;
	};

	return (
		<Card className={classes.root}>
			<CardActionArea component={Link} to={`/books/${book.id}`}>
				<CardMedia
					component="img"
					alt={book.title}
					height="240"
					image={(book.links ? book.links.image : null) || defaultBookImage}
					title={book.title}
				/>
				<CardContent>
					<Typography gutterBottom variant="h5" component="h2">
						{book.title}
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						{book.authorName}
					</Typography>
				</CardContent>
			</CardActionArea>
			<CardActions>
				{renderEditLink()}
				{renderDeleteLink()}
				<IconButton component={Link} to={`/books/${book.id}`}>
					<MenuBookIcon />
				</IconButton>
				<FavoriteButton book={book} />
			</CardActions>
		</Card>
	);
}

export default BookCell;
