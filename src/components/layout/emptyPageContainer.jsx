import React from 'react';
import { Container, Typography, Avatar, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Footer from '../footer';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	}
}));

export const emptyPageContainer = ({ title, children }) => {
	const classes = useStyles();
	console.log(title);
	console.log(children);
	return (<Container component="main" maxWidth="xs">
		<div className={classes.paper}>
			{/* <Avatar className={classes.avatar}>
				{ icon }
			</Avatar>*/
			<Typography component="h1" variant="h5">
				{ title }
			</Typography> }
			{children}
		</div>
		<Box mt={8}>
			<Footer />
		</Box>
	</Container>);
}
