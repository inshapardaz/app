import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { makeStyles } from '@material-ui/core/styles';

const defaultBookImage = '/resources/img/book_placeholder.png';

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
					alt="Contemplative Reptile"
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
				<IconButton aria-label="add to favorites">
					<FavoriteIcon />
				</IconButton>
			</CardActions>
		</Card>
	);
}

export default BookCell;
