import React, { useState, useCallback } from 'react';
import { FormattedMessage, useIntl } from "react-intl";
import { useSnackbar } from 'notistack';

import { DropzoneDialog } from 'material-ui-dropzone'
import MenuItem from '@material-ui/core/MenuItem';
import Typography from "@material-ui/core/Typography";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import PostAddIcon from '@material-ui/icons/PostAdd';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import CustomButton from '../customButton';
import { libraryService } from "../../services";

const PageUploadButton = ({ pages, onAdd, onFilesUploaded }) => {
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();
	const [isLoading, setLoading] = useState(true);
	const [showFilesUpload, setShowFilesUpload] = useState(false);
	const [showZipUpload, setShowZipUpload] = useState(false);

	const handleFileUpload = useCallback((files) => {
		if (files.length < 1) {
			return;
		}

		setLoading(true);
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
				.finally(() => setLoading(false));
		}
	}, [pages]);

	const handleZipFileUpload = useCallback((files) => {
		if (files.length < 1) {
			return;
		}

		setLoading(true);
		if (pages && pages.links.bulk_upload !== null) {
			libraryService.postFile(pages.links.bulk_upload, files[0])
				.then(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'pages.messages.saved' }), { variant: 'success' })
					setShowZipUpload(false);
					onFilesUploaded();
				})
				.catch(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'pages.messages.error.saving' }), { variant: 'error' })
				})
				.finally(() => setLoading(false));
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
			<MenuItem
				edge="start"
				color="inherit"
				aria-label="menu"
				onClick={() => setShowZipUpload(true)}>
				<ListItemIcon>
					<CloudUploadIcon fontSize="small" />
				</ListItemIcon>
				<Typography variant="inherit"><FormattedMessage id="page.action.uploadZip" /></Typography>
			</MenuItem>
			<DropzoneDialog
				open={showFilesUpload}
				onSave={handleFileUpload}
				acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
				showPreviews={true}
				maxFileSize={5000000}
				filesLimit={50}
				fullWidth={true}
				showAlerts={false}
				onClose={() => setShowFilesUpload(false)}
				dialogTitle={intl.formatMessage({ id: "page.action.upload" })}
				dropzoneText={intl.formatMessage({ id: "page.action.upload.help" })}
				cancelButtonText={intl.formatMessage({ id: "action.cancel" })}
				submitButtonText={intl.formatMessage({ id: "action.upload" })}
			/>
			<DropzoneDialog
				open={showZipUpload}
				onSave={handleZipFileUpload}
				acceptedFiles={['application/zip', 'application/x-zip-compressed']}
				filesLimit={1}
				maxFileSize={5000000}
				showPreviews={false}
				onClose={() => setShowZipUpload(false)}
				dialogTitle={intl.formatMessage({ id: "page.action.uploadZip" })}
				dropzoneText={intl.formatMessage({ id: "page.action.uploadZip.help" })}
				cancelButtonText={intl.formatMessage({ id: "action.cancel" })}
				submitButtonText={intl.formatMessage({ id: "action.upload" })}
				onDropRejected={(rejectedFiles) => console.dir(rejectedFiles)}
			/>
		</CustomButton>
	);
};

export default PageUploadButton;
