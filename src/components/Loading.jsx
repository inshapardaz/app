import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff'
	},
	backdropTransparent: {
		color: 'rgba(0,0,0,1)'
	}
}));

const Loading = ({ fullScreen = true }) => {
	const classes = useStyles();

	if (fullScreen) {
		return (
			<Backdrop className={classes.backdrop} open>
				<CircularProgress color="inherit" />
			</Backdrop>
		);
	}

	return (
		<Backdrop className={classes.backdropTransparent} open>
			<CircularProgress color="inherit" />
		</Backdrop>
	);

}

export default Loading;
