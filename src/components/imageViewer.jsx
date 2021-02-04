import React from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
	imageContainer: {
		overflow: 'scroll',
	},
	image: {
		maxWidth: '100%'
	}
});


const ImageViewer = ({ src }) => {
	const classes = useStyles();

	return (<Container className={classes.imageContainer}>
		<img src={src} className={classes.image} />
	</Container >);
};

export default ImageViewer;
