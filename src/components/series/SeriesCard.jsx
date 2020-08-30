import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import { FormattedMessage } from 'react-intl';
import MenuBookIcon from '@material-ui/icons';

const useStyles = makeStyles({
	root : {
	  minWidth : 275
	},
	title : {
	  fontSize : 14
	},
	pos : {
	  marginBottom : 12
	}
});

export default function SeriesCard ({ series })
{
	const classes = useStyles();
	return (
		<Card className={classes.root}>
			<CardContent>
				<Typography variant="h5" component="h2">
					{series.name}
				</Typography>
				<Typography className={classes.pos} color="textSecondary">
					<FormattedMessage id="series.item.book.count" values={{ count : series.bookCount }} />
				</Typography>
				<Typography variant="body2" component="p">
					{series.description}
				</Typography>
			</CardContent>
		</Card>);
}
