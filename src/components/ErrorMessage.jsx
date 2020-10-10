import React from 'react';
import { Typography } from '@material-ui/core';

const ErrorMessage = (props) =>
{
	return (
		<Typography>{props.message}</Typography>
	);
}

export default ErrorMessage;
