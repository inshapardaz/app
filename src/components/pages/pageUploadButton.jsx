import React, { useState, useCallback } from 'react';
import { useIntl } from "react-intl";
import { useSnackbar } from 'notistack';

import { DropzoneDialog } from 'material-ui-dropzone';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddCircleIcon from "@material-ui/icons/AddCircle";
import PostAddIcon from '@material-ui/icons/PostAdd';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
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
		<>
			<ListItem button onClick={onAdd} >
				<ListItemIcon>
					<AddCircleIcon />
				</ListItemIcon>
				<ListItemText primary={intl.formatMessage({ id: `page.action.create` })} />
			</ListItem>

			<ListItem button onClick={() => setShowFilesUpload(true)}>
				<ListItemIcon>
					<PostAddIcon />
				</ListItemIcon>
				<ListItemText primary={intl.formatMessage({ id: `page.action.upload` })} />
			</ListItem>

			<ListItem button onClick={() => setShowFilesUpload(true)}>
				<ListItemIcon>
					<AddCircleIcon />
				</ListItemIcon>
				<ListItemText primary={intl.formatMessage({ id: `page.action.upload` })} />
			</ListItem>
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
		</>

	);
};

export default PageUploadButton;
