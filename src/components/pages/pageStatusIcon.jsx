import React from 'react';
import { FormattedMessage } from "react-intl";

import Tooltip from '@material-ui/core/Tooltip';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import KeyboardHideIcon from '@material-ui/icons/KeyboardHide';
import SpellcheckIcon from '@material-ui/icons/Spellcheck';
import DoneIcon from '@material-ui/icons/Done';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import PhotoFilterIcon from '@material-ui/icons/PhotoFilter';

const PageStatusIcon = ({ status, tooltip = true }) => {

	if (tooltip) {
		switch (status) {
			case "Available":
				return (
					<Tooltip title={<FormattedMessage id="status.Available" />} >
						<PhotoFilterIcon />
					</Tooltip>);
			case "Typing":
				return (
					<Tooltip title={<FormattedMessage id="status.Typing" />} >
						<KeyboardIcon />
					</Tooltip>);
			case "Typed":
				return (
					<Tooltip title={<FormattedMessage id="status.Typed" />} >
						<KeyboardHideIcon />
					</Tooltip>);
			case "InReview":
				return (
					<Tooltip title={<FormattedMessage id="status.InReview" />} >
						<SpellcheckIcon />
					</Tooltip>);
			case "Completed":
				return (
					<Tooltip title={<FormattedMessage id="status.Completed" />} >
						<DoneIcon />
					</Tooltip>);
			default:
				return (
					<Tooltip title={<FormattedMessage id="page.all" />} >
						<FileCopyIcon />
					</Tooltip>);
		}
	}

	switch (status) {
		case "Available":
			return (<PhotoFilterIcon />);
		case "Typing":
			return (<KeyboardIcon />);
		case "Typed":
			return (<KeyboardHideIcon />);
		case "InReview":
			return (<SpellcheckIcon />);
		case "Completed":
			return (<DoneIcon />);
		default:
			return (<FileCopyIcon />);
	}
}

export default PageStatusIcon;
