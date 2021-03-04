import React from 'react';
import { FormattedMessage } from "react-intl";

import Tooltip from '@material-ui/core/Tooltip';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import RateReviewIcon from '@material-ui/icons/RateReview';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DescriptionIcon from '@material-ui/icons/Description';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';

const PageStatusIcon = ({ status }) => {
	switch (status) {
		case 0: //Available
			return (
				<Tooltip title={<FormattedMessage id="status.Available" />} >
					<InsertDriveFileOutlinedIcon />
				</Tooltip>);
		case 1: //Typing
			return (
				<Tooltip title={<FormattedMessage id="status.Typing" />} >
					<AssignmentIndIcon />
				</Tooltip>);
		case 2: //Typed
			return (
				<Tooltip title={<FormattedMessage id="status.Typed" />} >
					<AssignmentTurnedInIcon />
				</Tooltip>);
		case 3: //InReview
			return (
				<Tooltip title={<FormattedMessage id="status.InReview" />} >
					<RateReviewIcon />
				</Tooltip>);
		case 4: //Completed
			return (
				<Tooltip title={<FormattedMessage id="status.Completed" />} >
					<CheckCircleIcon />
				</Tooltip>);
		default:
			return (
				<Tooltip title={<FormattedMessage id="page.all" />} >
					<DescriptionIcon />
				</Tooltip>);
	}

	return null;
}

export default PageStatusIcon;
