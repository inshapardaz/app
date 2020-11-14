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
import { Tooltip } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import LibraryService from '../../services/LibraryService';

const defaultBookImage = '/images/book_placeholder.jpg';

function FavoriteButton ({ book, onUpdated })
{
	const changeFavorite = async () =>
	{
		try
		{
			if (book.links.create_favorite) {
				await LibraryService.post(book.links.create_favorite, {});
			}
			else
			{
				await LibraryService.delete(book.links.remove_favorite, {});
			}

			onUpdated();
		}
		catch (e)
		{
			console.dir(e);
		}
	};

	if (book.links.create_favorite)
	{
		return (<Tooltip title={<FormattedMessage id="books.action.favorite.add"/>} >
			<IconButton aria-label="add to favorites" onClick={() => changeFavorite()}>
				<FavoriteBorderIcon />
			</IconButton>
		</Tooltip>);
	}

	return (<Tooltip title={<FormattedMessage id="books.action.favorite.remove"/>} >
		<IconButton aria-label="remove from favorites" onClick={() => changeFavorite()}>
			<FavoriteIcon />
		</IconButton>
	</Tooltip>);
}

function BookCell ({ book, onEdit, onDelete, onUpdated })
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
			return (<Tooltip title={<FormattedMessage id="action.edit"/>} >
				<IconButton onClick={() => onEdit(book)}>
					<EditOutlinedIcon />
				</IconButton>
			</Tooltip>);
		}
		return null;
	};

	const renderDeleteLink = () =>
	{
		if (book.links.delete)
		{
			return (<Tooltip title={<FormattedMessage id="action.delete"/>} >
				<IconButton onClick={() => onDelete(book)}>
					<DeleteForeverOutlinedIcon />
				</IconButton>
			</Tooltip>);
		}
		return null;
	};

	const setDefaultBookImage = (ev) =>
	{
		ev.target.src = defaultBookImage;
	};

	return (
		<Card className={classes.root}>
			<CardActionArea component={Link} to={`/books/${book.id}`}>
				<CardMedia
					component="img"
					alt={book.title}
					height="360"
					image={(book.links ? book.links.image : null) || defaultBookImage}
					title={book.title}
					onError={setDefaultBookImage}
				/>
				<CardContent>
					<Tooltip title={book.title} aria-label={book.title}>
						<Typography gutterBottom variant="h5" component="h2" noWrap>
							{book.title}
						</Typography>
					</Tooltip>
					<Typography variant="body2" color="textSecondary" component="p">
						{book.authorName}
					</Typography>
				</CardContent>
			</CardActionArea>
			<CardActions>
				{renderEditLink()}
				{renderDeleteLink()}
				<Tooltip title={<FormattedMessage id="action.read"/>} >
					<IconButton component={Link} to={`/books/${book.id}`}>
						<MenuBookIcon />
					</IconButton>
				</Tooltip>
				<FavoriteButton book={book} onUpdated={() => onUpdated()} />
			</CardActions>
		</Card>
	);
}

export default BookCell;
