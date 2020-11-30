import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = () => makeStyles((theme) => ({
	footer : {
		backgroundColor : theme.palette.background.paper,
		padding : theme.spacing(6)
	}
}));

const copyright = () =>
{
	return (
		<Typography variant="body2" color="textSecondary" align="center">
            <FormattedMessage id="footer.copyrights" />
        </Typography>
	);
};

const Footer = () =>
{	
	const classes = useStyles();
	return (
		<footer className={classes.footer}>
			<Typography variant="h6" align="center" gutterBottom>
				<FormattedMessage id="app" />
			</Typography>
			<Typography variant="subtitle1" align="center" color="textSecondary" component="p">
			</Typography>
			{copyright()}
		</footer>
	);
}

export default Footer;