import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

// MUI
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// Local Imports
import PageUploader from '@/components/pages/pageUploader';

const AddIssuePageMenu = ({ issue, onFilesUploaded }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const [acceptFiles, setAcceptFiles] = useState('');
  const [fileLimit, setFileLimit] = useState(1);
  const [showFilesUpload, setShowFilesUpload] = useState(false);

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!issue || !issue.links.add_pages) return null;

  const handleImageUpload = () => {
    setAcceptFiles('image/jpeg,image/png,image/bmp');
    setFileLimit(200);
    setShowFilesUpload(true);
    handleClose();
  };

  const handlePdfUpload = () => {
    setAcceptFiles('application/pdf,application/zip,application/x-zip-compressed');
    setFileLimit(20);
    setShowFilesUpload(true);
    handleClose();
  };

  return (
    <>
      <Tooltip title={<FormattedMessage id="page.editor.header.add" />}>
        <Button
          id="add-page-button"
          aria-controls="add-page-menu"
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          variant="outlined"
          disableElevation
          onClick={handleClick}
          startIcon={<AddCircleOutlineIcon />}
          endIcon={<KeyboardArrowDownIcon />}
        />
      </Tooltip>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'add-pages-button' }}
      >
        <MenuItem onClick={handleClose} component={Link} to={`/periodicals/${issue.periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}/pages/create`}>
          <PostAddOutlinedIcon sx={{ mr: (theme) => theme.spacing(1) }} />
          <FormattedMessage id="page.action.create" />
        </MenuItem>
        <MenuItem onClick={handleImageUpload}>
          <AddPhotoAlternateOutlinedIcon sx={{ mr: (theme) => theme.spacing(1) }} />
          <FormattedMessage id="page.action.upload" />
        </MenuItem>
        <MenuItem onClick={handlePdfUpload}>
          <DriveFolderUploadOutlinedIcon sx={{ mr: (theme) => theme.spacing(1) }} />
          <FormattedMessage id="page.action.upload" />
        </MenuItem>
      </Menu>
      <PageUploader
        show={showFilesUpload}
        acceptFiles={acceptFiles}
        fileLimit={fileLimit}
        createLink={issue.links.create_multiple}
        onFilesUploaded={onFilesUploaded}
        onClose={() => setShowFilesUpload(false)}
      />
    </>
  );
};

AddIssuePageMenu.defaultProps = {
  issue: null,
  onFilesUploaded: () => {},
};

AddIssuePageMenu.propTypes = {
  issue: PropTypes.shape({
    id: PropTypes.number,
    pageCount: PropTypes.number,
    periodicalId: PropTypes.number,
    volumeNumber: PropTypes.number,
    issueNumber: PropTypes.number,
    links: PropTypes.shape({
      add_pages: PropTypes.string,
      create_multiple: PropTypes.string,
    }),
  }),
  onFilesUploaded: PropTypes.func,
};

export default AddIssuePageMenu;
