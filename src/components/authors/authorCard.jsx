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
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip } from '@material-ui/core';

const defaultAuthorImage = '/images/author_placeholder.jpg';

function AuthorCard ({ author, onEdit, onDelete })
{
	const classes = makeStyles(() => ({
		root : {
			maxWidth : 345
		}
	}));

	const renderEditLink = () =>
	{
		if (author.links.update)
		{
			return (
				<IconButton onClick={() => onEdit(author)}>
					<EditOutlinedIcon />
				</IconButton>);
		}
		return null;
	};

	const renderDeleteLink = () =>
	{
		if (author.links.delete)
		{
			return (
				<IconButton onClick={() => onDelete(author)}>
					<DeleteForeverOutlinedIcon />
				</IconButton>
			);
		}
		return null;
	};

	const setDefaultAuthorImage = (ev) =>
	{
		ev.target.src = defaultAuthorImage;
	};

	return (
		<Card className={classes.root}>
			<CardActionArea component={Link} to={`/authors/${author.id}`}>
				<CardMedia
					component="img"
					alt={author.name}
					height="240"
					image={(author.links ? author.links.image : null) || defaultAuthorImage}
					onError={setDefaultAuthorImage}
				/>
				<CardContent>
					<Tooltip title={author.name} aria-label="add">
						<Typography gutterBottom variant="h5" component="h2" noWrap>
							{author.name}
						</Typography>
					</Tooltip>
					<Typography variant="body2" color="textSecondary" component="p">
						<FormattedMessage id="authors.item.book.count" values={{ count : author.bookCount }} />
					</Typography>
				</CardContent>
			</CardActionArea>
			<CardActions>
				{renderEditLink()}
				{renderDeleteLink()}
				<IconButton component={Link} to={`/books?author=${author.id}`}>
					<MenuBookIcon />
				</IconButton>
			</CardActions>
		</Card>
	);
}

export default AuthorCard;
