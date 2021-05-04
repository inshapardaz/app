import React from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
	imageContainer: {
		overflow: 'auto'
	},
	imageContainerNormal: {
		height: 'calc(100vh - 188px)',
	},
	imageContainerFull: {
		height: 'calc(100vh - 70px)',
	},
	image: {
		width: props => `${props.scale}%`
	}
});

const ImageViewer = ({ imageUrl, scale = 100, fullScreen = false }) => {
	const classes = useStyles({ scale });

	return (<Container
		className={`${classes.imageContainer} ${fullScreen ? classes.imageContainerFull : classes.imageContainerNormal}`}
		fixed >
		<img src={imageUrl} className={classes.image} />
	</Container >);
};

export default ImageViewer;
