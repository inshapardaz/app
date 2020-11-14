import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';

const defaultSeriesImage = '/images/series_placeholder.jpg';

const SeriesCard = ({ series, onEdit, onDelete }) =>
{
	const classes = makeStyles(() => ({
		root : {
			maxWidth : 345
		}
	}));

	const renderEditLink = () =>
	{
		if (series.links.update)
		{
			return (
				<IconButton onClick={() => onEdit(series)}>
					<EditOutlinedIcon />
				</IconButton>);
		}
		return null;
	};

	const renderDeleteLink = () =>
	{
		if (series.links.delete)
		{
			return (
				<IconButton onClick={() => onDelete(series)}>
					<DeleteForeverOutlinedIcon />
				</IconButton>
			);
		}
		return null;
	};

	const setDefaultSeriesImage = (ev) =>
	{
		ev.target.src = defaultSeriesImage;
	};

	return (
		<Card className={classes.root}>
			<CardActionArea component={Link} to={`/series/${series.id}`}>
				<CardMedia
					component="img"
					alt={series.name}
					height="240"
					image={(series.links ? series.links.image : null) || defaultSeriesImage}
					onError={setDefaultSeriesImage}
				/>
				<CardContent>
					<Typography gutterBottom variant="h5" component="h2" noWrap>
						{series.name}
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						<FormattedMessage id="series.item.book.count" values={{ count : series.bookCount }} />
					</Typography>
					<Typography variant="body2" color="textSecondary" component="p">
						{series.description}
					</Typography>
				</CardContent>
			</CardActionArea>
			<CardActions>
				{renderEditLink()}
				{renderDeleteLink()}
				<IconButton component={Link} to={`/books?series=${series.id}`}>
					<MenuBookIcon />
				</IconButton>
			</CardActions>
		</Card>
	);
};

export default SeriesCard;
