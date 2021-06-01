import React from 'react';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import LanguageSelector from '../header/languageSelector';
import { Grid } from '@material-ui/core';

const useStyles = () => makeStyles((theme) => ({
	langaugeSelector: {
		marginLeft: 8,
		marginRight: 8,
	},
	footer: {
		backgroundColor: theme.palette.background.paper,
		padding: theme.spacing(6),
	}
}));

export const Copyright = () => {
	const classes = useStyles();

	return (
		<Grid container component="main" alignItems="center">
			<Grid item>
				<Typography variant="body2" color="textSecondary" align="center">
					<FormattedMessage id="footer.copyrights" />
				</Typography>
			</Grid>
			<Grid item>
				<LanguageSelector className={classes.langaugeSelector} />
			</Grid>
		</Grid>
	);
};

const Footer = () => {
	const classes = useStyles();
	return (
		<footer className={classes.footer}>
			<Typography variant="h6" align="center" gutterBottom>
				<FormattedMessage id="app" />
			</Typography>
			<Typography variant="subtitle1" align="center" color="textSecondary" component="p">
			</Typography>
			<Copyright />
		</footer>
	);
}

export default Footer;
