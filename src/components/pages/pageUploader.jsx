/* eslint-disable no-plusplus */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSnackbar } from 'notistack';

// MUI
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileIcon from '@mui/icons-material/FileCopy';

// Local Imports
import { libraryService } from '@/services';
import EditorDialog from '@/components/editorDialog';
import Empty from '@/components/empty';

const ImageList = ({ pages, onRemoved }) => (
  <Empty
    items={pages}
    message={<FormattedMessage id="page.messages.upload.empty" />}
  >
    <List>
      {pages.map((page) => (
        <ListItem
          key={page.name}
          secondaryAction={(
            <IconButton edge="end" aria-label="delete" onClick={() => onRemoved(page)}>
              <DeleteIcon />
            </IconButton>
                  )}
        >
          <ListItemAvatar>
            <Avatar>
              <FileIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={page.name} />
        </ListItem>
      ))}
    </List>
  </Empty>
);

ImageList.defaultProps = {
  pages: null,
  onRemoved: () => {},
};

ImageList.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.shape({
    ocrStatus: PropTypes.string,
  })),
  onRemoved: PropTypes.func,
};

const PageUpload = ({
  show, acceptFiles, fileLimit, createLink, onClose, onFilesUploaded,
}) => {
  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [busy, setBusy] = useState(false);
  const [files, setFiles] = useState([]);

  let inputElement = null;

  const onImageChanged = (event) => {
    const newFiles = event.currentTarget.files;
    const newList = [...files];

    for (let i = 0; i < newFiles.length; i++) {
      if (newList.length >= fileLimit) {
        enqueueSnackbar(intl.formatMessage({ id: 'page.messages.upload.limitReached' }), { variant: 'error' });
        break;
      }

      const newFile = newFiles[i];
      newList.push(newFile);
    }

    setFiles(newList);
  };

  const onFileRemoved = (page) => {
    const newList = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.name !== page.name) {
        newList.push(file);
      }
    }

    setFiles(newList);
  };

  const handleClose = () => {
    setFiles([]);
    onClose();
  };

  const handleFileUpload = () => {
    if (files.length < 1) {
      return;
    }

    setBusy(true);
    if (createLink !== null) {
      libraryService.postMultipleFile(createLink, files)
        .then(() => {
          enqueueSnackbar(intl.formatMessage({ id: 'pages.messages.saved' }), { variant: 'success' });
          onFilesUploaded();
          handleClose();
        })
        .catch(() => {
          enqueueSnackbar(intl.formatMessage({ id: 'pages.messages.error.saving' }), { variant: 'error' });
        })
        .finally(() => {
          setBusy(false);
        });
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
        <ImageList pages={files} onRemoved={onFileRemoved} />
        <ButtonGroup fullWidth>
          <Button
            onClick={handleFileUpload}
            startIcon={<CloudUploadIcon />}
            fullWidth
            variant="outlined"
            disabled={files.length <= 0}
          >
            <FormattedMessage id="page.action.upload.upload" />
          </Button>
          <Button
            onClick={() => (files.length >= fileLimit ? {} : inputElement.click())}
            startIcon={<AddPhotoAlternateIcon />}
            fullWidth
            variant="outlined"
            disabled={files.length >= fileLimit}
          >
            <FormattedMessage id="page.action.upload.addFiles" />
          </Button>
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
