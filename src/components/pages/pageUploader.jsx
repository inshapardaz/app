/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSnackbar } from 'notistack';

// MUI
import { green, red } from '@mui/material/colors';

import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ScheduleIcon from '@mui/icons-material/Schedule';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// Local Imports
import { libraryService } from '@/services';
import EditorDialog from '@/components/editorDialog';
import Empty from '@/components/empty';

const getStatusIcon = (status) => {
  if (status === 'pending') {
    return (<ScheduleIcon />);
  }
  if (status === 'processing') {
    return (<HourglassEmptyIcon />);
  }
  if (status === 'complete') {
    return (<CheckCircleOutlineIcon style={{ color: green[500] }} />);
  }
  if (status === 'error') {
    return (<ErrorOutlineIcon style={{ color: red[500] }} />);
  }

  return null;
};

const UploadList = ({ uploads, isUploading, onRemoved }) => (
  <Empty
    items={uploads}
    message={<FormattedMessage id="page.messages.upload.empty" />}
  >
    <List>
      {uploads.map((upload) => (
        <ListItem
          key={upload.file.name}
          secondaryAction={!isUploading && (
            <IconButton edge="end" aria-label="delete" onClick={() => onRemoved(upload)}>
              <DeleteIcon />
            </IconButton>
          )}
        >
          <ListItemAvatar>
            {getStatusIcon(upload.status)}
          </ListItemAvatar>
          <ListItemText primary={upload.file.name} />
        </ListItem>
      ))}
    </List>
  </Empty>
);

UploadList.defaultProps = {
  uploads: null,
  isUploading: false,
  onRemoved: () => {},
};

UploadList.propTypes = {
  uploads: PropTypes.arrayOf(PropTypes.shape({
    status: PropTypes.string,
    file: PropTypes.shape({
      name: PropTypes.string,
    }),
  })),
  isUploading: PropTypes.bool,
  onRemoved: PropTypes.func,
};

const PageUpload = ({
  show, acceptFiles, fileLimit, createLink, onClose, onFilesUploaded,
}) => {
  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [busy, setBusy] = useState(false);
  const [uploads, setUploads] = useState([]);

  let inputElement = null;

  const onImageChanged = (event) => {
    const newFiles = event.currentTarget.files;
    const newUploads = [...uploads];

    for (let i = 0; i < newFiles.length; i++) {
      if (newUploads.length >= fileLimit) {
        enqueueSnackbar(intl.formatMessage({ id: 'page.messages.upload.limitReached' }), { variant: 'error' });
        break;
      }

      const newFile = newFiles[i];
      newUploads.push({
        status: 'pending',
        file: newFile,
      });
    }

    setUploads(newUploads);
  };

  const onFileRemoved = (page) => {
    const newUploads = [];
    for (let i = 0; i < uploads.length; i++) {
      const upload = uploads[i];
      if (upload.file.name !== page.name) {
        newUploads.push(upload);
      }
    }

    setUploads(newUploads);
  };

  const handleClose = () => {
    setUploads([]);
    onClose();
  };

  const setUploadStatus = (upload, status) => {
    const newUploads = [];
    for (let i = 0; i < uploads.length; i++) {
      const u = uploads[i];
      if (u.file.name === upload.file.name) {
        const newUpload = u;
        newUpload.status = status;
        newUploads.push(newUpload);
      } else {
        newUploads.push(u);
      }
    }

    setUploads(newUploads);
  };

  const handleFileUpload = async () => {
    if (uploads.length < 1) {
      return;
    }

    setBusy(true);
    if (createLink !== null) {
      setBusy(true);
      for (let i = 0; i < uploads.length; i++) {
        const upload = uploads[i];
        if (upload !== null && upload !== undefined && upload.status !== 'complete') {
          setUploadStatus(upload, 'processing');
          await libraryService.postFile(createLink, upload.file)
            .then(() => setUploadStatus(upload, 'complete'))
            .catch(() => setUploadStatus(upload, 'error'));
        }
      }

      if (uploads.filter((p) => p.status === 'error').length === 0) {
        enqueueSnackbar(intl.formatMessage({ id: 'pages.messages.saved' }), { variant: 'success' });
        onFilesUploaded();
        handleClose();
      } else {
        enqueueSnackbar(intl.formatMessage({ id: 'pages.messages.error.saving' }), { variant: 'error' });
      }
      setBusy(false);
    }
  };

  return (
    <>
      <EditorDialog
        show={show}
        loading={busy}
        title={<FormattedMessage id="page.action.upload" />}
        onCancelled={handleClose}
      >
        <UploadList uploads={uploads} isUploading={busy} onRemoved={onFileRemoved} />
        <ButtonGroup fullWidth>
          <LoadingButton
            onClick={handleFileUpload}
            startIcon={<CloudUploadIcon />}
            fullWidth
            variant="outlined"
            disabled={uploads.length <= 0}
            loading={busy}
          >
            <FormattedMessage id="page.action.upload.upload" />
          </LoadingButton>
          <LoadingButton
            onClick={() => (uploads.length >= fileLimit ? {} : inputElement.click())}
            startIcon={<AddPhotoAlternateIcon />}
            fullWidth
            variant="outlined"
            disabled={uploads.length >= fileLimit}
            loading={busy}
          >
            <FormattedMessage id="page.action.upload.addFiles" />
          </LoadingButton>
        </ButtonGroup>
      </EditorDialog>
      <input
        id="file"
        name="file"
        type="file"
        multiple={fileLimit > 1}
        style={{ display: 'none' }}
        accept={acceptFiles}
        ref={(input) => { inputElement = input; }}
        onChange={onImageChanged}
      />
    </>
  );
};

PageUpload.defaultProps = {
  show: false,
  onClose: () => {},
  onFilesUploaded: () => {},
};

PageUpload.propTypes = {
  show: PropTypes.bool,
  acceptFiles: PropTypes.string.isRequired,
  fileLimit: PropTypes.number.isRequired,
  createLink: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onFilesUploaded: PropTypes.func,
};
export default PageUpload;
