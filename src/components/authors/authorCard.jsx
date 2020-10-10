import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import { makeStyles } from '@material-ui/core/styles';

const defaultAuthorImage = '/resources/img/auhtor_placeholder.png';

function AuthorCard ({ author })
{
	const classes = makeStyles(() => ({
		root : {
			maxWidth : 345
		}
	}));

	return (
		<Card className={classes.root}>
			<CardActionArea component={Link} to={`/authors/${author.id}`}>
				<CardMedia
					component="img"
					alt={author.name}
					height="240"
					image={(author.links ? author.links.image : null) || defaultAuthorImage}
					title={author.name}
				/>
				<CardContent>
					<Typography gutterBottom variant="h5" component="h2">
						{author.name}
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						<FormattedMessage id="authors.item.book.count" values={{ count : author.bookCount }} />
					</Typography>
				</CardContent>
			</CardActionArea>
			<CardActions>
				<IconButton component={Link} to={`/books?author=${author.id}`}>
					<MenuBookIcon />
				</IconButton>
			</CardActions>
		</Card>
	);
}

export default AuthorCard;
