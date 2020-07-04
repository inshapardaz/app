import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';

export default class Footer  extends Component
{
	useStyles = () => makeStyles((theme) => ({
		footer : {
		  backgroundColor : theme.palette.background.paper,
		  padding : theme.spacing(6)
		}
	}));

	copyright ()
	{
		return (
		  <Typography variant="body2" color="textSecondary" align="center">
				{'Copyright © '}
				<Link color="inherit" href="https://material-ui.com/">
					<FormattedMessage id="app" />
				</Link>{' '}
				{new Date().getFullYear()}
				{'.'}
		  </Typography>
		);
	}

	render ()
	{
		const classes = this.useStyles();
		return (
			<footer className={classes.footer}>
				<Typography variant="h6" align="center" gutterBottom>
					<FormattedMessage id="app" />
				</Typography>
				<Typography variant="subtitle1" align="center" color="textSecondary" component="p">
				</Typography>
				{this.copyright()}
		  </footer>
		);
		// return (
		// 	<footer className="footer__area bg__cat--8 brown--color">
		// 		<div className="copyright__wrapper">
		// 			<div className="container">
		// 				<div className="row">
		// 					<div className="col-lg-6 col-md-6 col-sm-12">
		// 						<div className="copyright">
		// 							<div className="copy__right__inner text-right">
		// 								<p> </p>
		// 							</div>
		// 						</div>
		// 					</div>
		// 					<div className="col-lg-6 col-md-6 col-sm-12">
		// 						<div className="payment text-right">
		// 							<img src="images/icons/payment.png" alt="" />
		// 						</div>
		// 					</div>
		// 				</div>
		// 			</div>
		// 		</div>
		// 	</footer>);
	}
}
