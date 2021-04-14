import React, { useState, useCallback } from 'react';
import { FormattedMessage, useIntl } from "react-intl";
import { useSnackbar } from 'notistack';

import { DropzoneDialog } from 'material-ui-dropzone'
import MenuItem from '@material-ui/core/MenuItem';
import Typography from "@material-ui/core/Typography";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import PostAddIcon from '@material-ui/icons/PostAdd';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import CustomButton from '../customButton';
import { libraryService } from "../../services";

const PageUploadButton = ({ pages, onAdd, onUploadStarted, onFilesUploaded }) => {
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();
	const [isLoading, setLoading] = useState(false);
	const [showFilesUpload, setShowFilesUpload] = useState(false);

	const handleFileUpload = useCallback((files) => {
		if (files.length < 1) {
			return;
		}

		setLoading(true);
		onUploadStarted && onUploadStarted(true);
		if (pages && pages.links.create_multiple !== null) {
			libraryService.postMultipleFile(pages.links.create_multiple, files)
				.then(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'pages.messages.saved' }), { variant: 'success' })
					setShowFilesUpload(false);
					onFilesUploaded();
				})
				.catch(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'pages.messages.error.saving' }), { variant: 'error' })
				})
				.finally(() => {
					setLoading(false);
					onUploadStarted && onUploadStarted(false);
				});
		}
	}, [pages]);

	return (
		<CustomButton title={intl.formatMessage({ id: "page.action.create" })} fullWidth menu>
			<MenuItem
				edge="start"
				color="inherit"
				aria-label="menu"
				onClick={() => onAdd()}>
				<ListItemIcon>
					<AddCircleIcon fontSize="small" />
				</ListItemIcon>
				<Typography variant="inherit"><FormattedMessage id="page.action.create" /></Typography>
			</MenuItem>
			<MenuItem
				edge="start"
				color="inherit"
				aria-label="menu"
				onClick={() => setShowFilesUpload(true)}>
				<ListItemIcon>
					<PostAddIcon fontSize="small" />
				</ListItemIcon>
				<Typography variant="inherit"><FormattedMessage id="page.action.upload" /></Typography>
			</MenuItem>
			<Backdrop open={isLoading}>
				<CircularProgress color="inherit" />
			</Backdrop>
			{!isLoading &&
				<DropzoneDialog
					open={showFilesUpload}
					onSave={handleFileUpload}
					acceptedFiles={['image/jpeg', 'image/png', 'image/bmp', 'application/pdf', 'application/zip', 'application/x-zip-compressed']}
					showPreviews={true}
					maxFileSize={104857600}
					filesLimit={50}
					fullWidth={true}
					showAlerts={true}
					onClose={() => setShowFilesUpload(false)}
					dialogTitle={intl.formatMessage({ id: "page.action.upload" })}
					dropzoneText={intl.formatMessage({ id: "page.action.upload.help" })}
					cancelButtonText={intl.formatMessage({ id: "action.cancel" })}
					submitButtonText={intl.formatMessage({ id: "action.upload" })}
				/>}
		</CustomButton>
	);
};

export default PageUploadButton;
