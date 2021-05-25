import React, { useState, useCallback } from 'react';
import { FormattedMessage, useIntl } from "react-intl";
import { useSnackbar } from 'notistack';

import { DropzoneDialog } from 'material-ui-dropzone';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import AddCircleIcon from "@material-ui/icons/AddCircle";
import PostAddIcon from '@material-ui/icons/PostAdd';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { libraryService } from "../../services";

const PageUploadButton = ({ pages, onAdd, onUploadStarted, onFilesUploaded }) => {
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();
	const [isLoading, setLoading] = useState(false);
	const [showFilesUpload, setShowFilesUpload] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleFileUpload = useCallback((files) => {
		if (files.length < 1) {
			return;
		}

		setLoading(true);
		handleClose();
		onUploadStarted && onUploadStarted(true);
		if (pages && pages.links.create_multiple !== null) {
			libraryService.postMultipleFile(pages.links.create_multiple, files)
				.then(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'pages.messages.saved' }), { variant: 'success' })
					onFilesUploaded();
				})
				.catch(() => {
					enqueueSnackbar(intl.formatMessage({ id: 'pages.messages.error.saving' }), { variant: 'error' })
				})
				.finally(() => {
					setLoading(false);
					setShowFilesUpload(false);
					onUploadStarted && onUploadStarted(false);
				});
		}
	}, [pages]);

	return (
		<>
			<Button aria-controls="add-page-menu" aria-haspopup="true" onClick={handleClick} startIcon={<AddCircleIcon />} endIcon={<ExpandMoreIcon />}>
				<FormattedMessage id="page.editor.header.add" />
			</Button>
			<Menu
				id="fade-menu"
				anchorEl={anchorEl}
				keepMounted
				open={open}
				onClose={handleClose}
			>
				<MenuItem onClick={onAdd} >
					<ListItemIcon>
						<AddCircleIcon />
					</ListItemIcon>
					<FormattedMessage id="page.action.create" />
				</MenuItem>

				<MenuItem onClick={() => setShowFilesUpload(true)}>
					<ListItemIcon>
						<PostAddIcon />
					</ListItemIcon>
					<FormattedMessage id="page.action.upload" />
				</MenuItem>

				<MenuItem onClick={() => setShowFilesUpload(true)}>
					<ListItemIcon>
						<AddCircleIcon />
					</ListItemIcon>
					<FormattedMessage id="page.action.upload" />
				</MenuItem>
				<Backdrop open={isLoading}>
					<CircularProgress color="inherit" />
				</Backdrop>
				{!isLoading &&
					<DropzoneDialog
						open={showFilesUpload}
						onSave={handleFileUpload}
						acceptedFiles={['image/jpeg', 'image/png', 'image/bmp', 'application/pdf', 'application/zip', 'application/x-zip-compressed']}
						showPreviews
						maxFileSize={104857600}
						filesLimit={50}
						fullWidth
						showAlerts
						onClose={() => setShowFilesUpload(false)}
						dialogTitle={intl.formatMessage({ id: "page.action.upload" })}
						dropzoneText={intl.formatMessage({ id: "page.action.upload.help" })}
						cancelButtonText={intl.formatMessage({ id: "action.cancel" })}
						submitButtonText={intl.formatMessage({ id: "action.upload" })}
					/>}
			</Menu>
		</>
	);
};

export default PageUploadButton;
