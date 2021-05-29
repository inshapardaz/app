import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles } from "@material-ui/core/styles";
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => ({
	imageContainer: {
		overflow: 'auto'
	},
	imageContainerNormal: {
		height: 'calc(100vh - 188px)',
	},
	imageContainerFull: {
		height: 'calc(100vh - 70px)',
	},
	speedDial: {
		position: 'absolute',
		'&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
			bottom: theme.spacing(2),
			right: theme.spacing(2),
		},
		'&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
			top: theme.spacing(2),
			left: theme.spacing(2),
		},
	}
}));

const ImageViewer = ({ imageUrl, fullScreen = false }) => {
	const classes = useStyles();
	const intl = useIntl();
	const [scale, setScale] = useState(100);
	const [showSpeedDialMenu, setShowSpeedDialMenu] = React.useState(false);

	const onZoomIn = () => {
		setScale(scale + 5);
	};

	const onZoomOut = () => {
		if (scale > 5) {
			setScale(scale - 5);
		}
	};

	const handleClose = () => {
		setShowSpeedDialMenu(false);
	};

	const handleOpen = () => {
		setShowSpeedDialMenu(true);
	};

	return (<Container
		className={`${classes.imageContainer} ${fullScreen ? classes.imageContainerFull : classes.imageContainerNormal}`}
		fixed >
		<img src={imageUrl} style={{ width: `${scale}%` }} />
		<SpeedDial
			ariaLabel="image zoom"
			className={classes.speedDial}
			icon={<SpeedDialIcon />}
			onClose={handleClose}
			onOpen={handleOpen}
			open={showSpeedDialMenu}
			direction='up'
		>
			<SpeedDialAction
				key="zoom-in"
				icon={<ZoomInIcon />}
				tooltipTitle={intl.formatMessage({ id: 'action.zoom.in' })}
				onClick={onZoomIn}
			/>

			<SpeedDialAction
				key="zoom-out"
				icon={<ZoomOutIcon />}
				tooltipTitle={intl.formatMessage({ id: 'action.zoom.out' })}
				onClick={onZoomOut}
			/>
		</SpeedDial>
	</Container >);
};

export default ImageViewer;
