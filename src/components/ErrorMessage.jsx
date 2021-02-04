import React from 'react';
import { Typography } from '@material-ui/core';

const ErrorMessage = ({ message }) => {
	return (
		<Typography>{message}</Typography>
	);
}

export default ErrorMessage;
