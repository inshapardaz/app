import React from 'react';
import PropTypes from 'prop-types';
import ScheduleIcon from '@material-ui/icons/Schedule';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { green, red, } from '@material-ui/core/colors';

export const ProcessingStatus = {
	Pending: 'pending',
	Processing: 'processing',
	Complete: 'complete',
	Error: 'error',
	Skipped: 'skipped'
};

const ProcessingStatusIcon = ({ status }) => {
	if (status === ProcessingStatus.Pending) {
		return (<ScheduleIcon />);
	}
	else if (status === ProcessingStatus.Processing) {
		return (<HourglassEmptyIcon />);
	}
	else if (status === ProcessingStatus.Complete) {
		return (<CheckCircleOutlineIcon style={{ color: green[500] }} />);
	}
	else if (status === ProcessingStatus.Error) {
		return (<ErrorOutlineIcon style={{ color: red[500] }} />);
	}
}


ProcessingStatusIcon.propTypes = {
	status: PropTypes.string.isRequired
};

export default ProcessingStatusIcon;
