import React from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
	imageContainer: {
		overflow: 'auto',
		maxWidth: '100%',
		maxHeight: '100%'
	},
	image: {
		width: props => `${props.scale}%`
	}
});

const ImageViewer = ({ imageUrl, scale = 100 }) => {
	const classes = useStyles({ scale });

	return (<Container className={classes.imageContainer} >
		<img src={imageUrl} className={classes.image} />
	</Container >);
};

export default ImageViewer;
