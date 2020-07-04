import React from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const defaultBookImage = '/resources/img/book_placeholder.png';

function BookCell ({ book })
{
	const classes = makeStyles((theme) => ({
		card : {
		  height : '100%',
		  display : 'flex',
		  flexDirection : 'column'
		},
		cardMedia : {
		  paddingTop : '56.25%' // 16:9
		},
		cardContent : {
		  flexGrow : 1
		},
		footer : {
		  backgroundColor : theme.palette.background.paper,
		  padding : theme.spacing(6)
		}
	  }));

	return (
		<Card className={classes.card}>
			<CardMedia
				className={classes.cardMedia}
				image={book.links.image}
				title={book.title}
			/>
			<CardContent className={classes.cardContent}>
				<Typography gutterBottom variant="h5" component="h2">
					{book.title}
				</Typography>
				<Typography>
					{book.description}
				</Typography>
			</CardContent>
			<CardActions>
				<Button size="small" color="primary">
				View
				</Button>
				<Button size="small" color="primary">
				Edit
				</Button>
			</CardActions>
		</Card>
	);

	return (
		<div key={book.id} className="book book__style--3">
			<div className="book__thumb">
				<Link className="first__img" to={`/books/${book.id}`}>
					<img src={(book.links ? book.links.image : null) || defaultBookImage} alt={book.title}/>
				</Link>
				<Link className="second__img animation1" to={`/books/${book.id}`}>
					<img src={(book.links ? book.links.image : null) || defaultBookImage} alt={book.title} />
				</Link>
			</div>
			<div className="book__content content--center">
				<h4><Link to={`/books/${book.id}`}>{book.title}</Link></h4>
				<ul className="prize d-flex">
					<li><Link to={`/authors/${book.authorId}`}>{book.authorName}</Link></li>
				</ul>
			</div>
		</div>
	);
};

export default BookCell;
