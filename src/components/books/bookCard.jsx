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
import { makeStyles } from '@material-ui/core/styles';

const defaultBookImage = '/resources/img/book_placeholder.png';

function FavoriteButton ({ book })
{
	console.dir(book.links.create_favorite);
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

function BookCell ({ book })
{
	const classes = makeStyles(() => ({
		root : {
			maxWidth : 345
		}
	}));

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
				<IconButton component={Link} to={`/books/${book.id}`}>
					<MenuBookIcon />
				</IconButton>
				<FavoriteButton book={book} />
			</CardActions>
		</Card>
	);
}

export default BookCell;
