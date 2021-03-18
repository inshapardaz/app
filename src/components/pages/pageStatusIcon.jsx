import React from 'react';
import { FormattedMessage } from "react-intl";

import Tooltip from '@material-ui/core/Tooltip';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import RateReviewIcon from '@material-ui/icons/RateReview';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DescriptionIcon from '@material-ui/icons/Description';
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';

const PageStatusIcon = ({ status, tooltip = true }) => {

	if (tooltip) {
		switch (status) {
			case "Available":
				return (
					<Tooltip title={<FormattedMessage id="status.Available" />} >
						<InsertDriveFileOutlinedIcon />
					</Tooltip>);
			case "Typing":
				return (
					<Tooltip title={<FormattedMessage id="status.Typing" />} >
						<AssignmentIndIcon />
					</Tooltip>);
			case "Typed":
				return (
					<Tooltip title={<FormattedMessage id="status.Typed" />} >
						<AssignmentTurnedInIcon />
					</Tooltip>);
			case "InReview":
				return (
					<Tooltip title={<FormattedMessage id="status.InReview" />} >
						<RateReviewIcon />
					</Tooltip>);
			case "Completed":
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
	}

	switch (status) {
		case "Available":
			return (<InsertDriveFileOutlinedIcon />);
		case "Typing":
			return (<AssignmentIndIcon />);
		case "Typed":
			return (<AssignmentTurnedInIcon />);
		case "InReview":
			return (<RateReviewIcon />);
		case "Completed":
			return (<CheckCircleIcon />);
		default:
			return (<DescriptionIcon />);
	}
}

export default PageStatusIcon;
