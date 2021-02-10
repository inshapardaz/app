import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Zoom from '@material-ui/core/Zoom';

const useStyles = makeStyles((theme) => ({
	root: {
		position: 'fixed',
		bottom: theme.spacing(2),
		right: theme.spacing(2),
	},
}));

const ScrollToTop = ({ color, size }) => {
	const classes = useStyles();

	const trigger = useScrollTrigger({
		disableHysteresis: true,
		threshold: 100,
	});

	const handleClick = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
		/*const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');

		if (anchor) {
			anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}*/
	};

	return (
		<Zoom in={trigger}>
			<div onClick={handleClick} role="presentation" className={classes.root}>
				<Fab color={color || 'primary'} size={size || 'small'} aria-label="scroll back to top">
					<KeyboardArrowUpIcon />
				</Fab>
			</div>
		</Zoom>
	);
}

export default ScrollToTop;
