import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles } from "@material-ui/core/styles";
import { Button, ButtonGroup, Toolbar } from '@material-ui/core';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';

// import { Resizable } from "re-resizable";
// import Draggable from 'react-draggable'

const useStyles = makeStyles({
	imageContainer: {
		overflow: 'auto',
	},
	image: {
		width: props => `${props.scale}%`
	}
});

const ImageViewer = ({ imageUrl, scale = 100 }) => {
	const classes = useStyles({ scale });

	return (<Container id="imageContainer" >
		{/* <Draggable bounds='#imageContainer'>
			<Resizable
				defaultSize={{
					width: 200,
					height: 360
				}}
				style={{
					background: `url(${imageUrl})`,
					backgroundSize: 'contain',
					backgroundRepeat: 'no-repeat'
				}}
				lockAspectRatio={true}
			>
			</Resizable>
		</Draggable> */}
		<img src={imageUrl} className={classes.image} />
	</Container >);
};

export default ImageViewer;
