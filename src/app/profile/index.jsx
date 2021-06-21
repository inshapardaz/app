import { Button, Card, CardActions, CardContent, CardMedia, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, Route, Switch } from 'react-router-dom';
import { accountService } from '../../services';
import { Details } from './details';
import { Update } from './update';

const useStyles = makeStyles((theme) => ({
	profileCard: {
		marginLeft: 8,
		marginRight: 8,
		width: 'calc(100vw-16px)'
	}
}));

const Profile = ({ match }) => {
	const { path } = match;
	const classes = useStyles();
	const user = accountService.userValue;

	return (
		<>
			<Card className={classes.profileCard}>
				<CardMedia
					component="img"
					alt="Contemplative Reptile"
					height="140"
					image="https://source.unsplash.com/random"
					title="Contemplative Reptile"
				/>
				<CardContent>
					<Typography gutterBottom variant="h4" component="div" align="center">
						{user.firstName} {user.lastName}
					</Typography>
				</CardContent>
				<CardActions>
					<Button component={Link} to={`${path}/update`} size="small"><FormattedMessage id="action.edit" /></Button>
					<Button component={Link} to={`/account/change-password`} size="small"><FormattedMessage id="changePassword" /></Button>
				</CardActions>
			</Card>
			<Switch>
				<Route exact path={path} component={Details} />
				<Route path={`${path}/update`} component={Update} />
			</Switch>
		</>
	);
}

export { Profile };
