import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { makeStyles, Typography, Button } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';

const useStyles = makeStyles(() => ({
	container: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		textAlign: 'center'
	},
	message: {
		paddingTop: '20px',
		paddingBottom: '20px'
	}
}));

const ErrorPage = () => {
	const classes = useStyles();
	const location = useLocation();
	const [reason, setReason] = useState('generic');

	useEffect(() => {
		const values = queryString.parse(location.search);
		if (values && values.reason) {
			setReason(values.reason);
		}
	}, [location]);

	return (<div className={classes.container}>
		<WarningRoundedIcon style={{ fontSize: 78 }} color="disabled" />
		<Typography className={classes.message}>
			<FormattedMessage id={`error.${reason}`} />
		</Typography>
		<Button href="/" color="primary" variant="outlined">
			<FormattedMessage id="action.goto.home" />
		</Button>
	</div>);
};

export default ErrorPage;
