import React, { useState, useCallback } from 'react';
import { FormattedMessage, useIntl } from "react-intl";
import { useSnackbar } from 'notistack';

import { DropzoneArea } from 'material-ui-dropzone';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import AddCircleIcon from "@material-ui/icons/AddCircle";
import FolderIcon from '@material-ui/icons/Folder';
import PermMediaIcon from '@material-ui/icons/PermMedia';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { libraryService } from "../../services";
import EditorDialog from '../editorDialog';

const PageUploadButton = ({ pages, onAdd, onUploadStarted, onFilesUploaded }) => {
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();
	const [busy, setBusy] = useState(false);
	const [showFilesUpload, setShowFilesUpload] = useState(false);
	const [files, setFiles] = useState([]);
	const [anchorEl, setAnchorEl] = useState(null);
	const [acceptFiles, setAcceptFiles] = useState([]);
	const [fileLimit, setFileLimit] = useState(1);
	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setFiles([]);
		setAnchorEl(null);
	};


	const handleChange = (files) => {
		setFiles(files);
	}

	const handleFileUpload = () => {
		if (files.length < 1) {
			return;
		}

		setBusy(true);
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
					setBusy(false);
					setShowFilesUpload(false);
					onUploadStarted && onUploadStarted(false);
				});
		}
	};

	const handleImageUpload = () => {
		setAcceptFiles(['image/jpeg', 'image/png', 'image/bmp']);
		setFileLimit(50);
		setShowFilesUpload(true);
	}

	const handlePdfUpload = () => {
		setAcceptFiles(['application/pdf', 'application/zip', 'application/x-zip-compressed']);
		setFileLimit(1);
		setShowFilesUpload(true);
	}

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

				<MenuItem onClick={handleImageUpload}>
					<ListItemIcon>
						<PermMediaIcon />
					</ListItemIcon>
					<FormattedMessage id="page.action.upload" />
				</MenuItem>

				<MenuItem onClick={handlePdfUpload}>
					<ListItemIcon>
						<FolderIcon />
					</ListItemIcon>
					<FormattedMessage id="page.action.upload" />
				</MenuItem>
			</Menu>
			<EditorDialog show={showFilesUpload} loading={busy}
				title={<FormattedMessage id="page.action.upload" />}
				onCancelled={() => setShowFilesUpload(false)}  >
				{!busy &&
					<DropzoneArea onChange={handleChange}
						acceptedFiles={acceptFiles}
						maxFileSize={200000000}
						filesLimit={fileLimit}
						showAlerts
						dialogTitle={intl.formatMessage({ id: "page.action.upload" })}
						dropzoneText={intl.formatMessage({ id: "page.action.upload.help" })} />
				}
				<Button aria-controls="add-page-menu" aria-haspopup="true" onClick={handleFileUpload}
					startIcon={<CloudUploadIcon />} fullWidth
					variant="contained"
					color="primary"
					disabled={files.length < 1}>
					<FormattedMessage id="page.editor.header.add" />
				</Button>
			</EditorDialog >
		</>
	);
};

export default PageUploadButton;
