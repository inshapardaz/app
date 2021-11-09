import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

// MUI
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import UploadFileIcon from '@mui/icons-material/UploadFile';

// Local Imports
import helpers from '@/helpers';

const ImageViewer = ({ page, createLink, onImageChanged }) => {
  const intl = useIntl();
  const [scale, setScale] = useState(parseInt(localStorage.getItem('image.zoom') || 100, 10));
  const [newImage, setNewImage] = useState(null);
  const [showSpeedDialMenu, setShowSpeedDialMenu] = React.useState(false);

  const onZoomIn = () => {
    setScale(scale + 5);
    localStorage.setItem('image.zoom', scale + 5);
  };

  const onZoomOut = () => {
    if (scale > 5) {
      setScale(scale - 5);
      localStorage.setItem('image.zoom', scale - 5);
    }
  };

  const handleClose = () => {
    setShowSpeedDialMenu(false);
  };

  const handleOpen = () => {
    setShowSpeedDialMenu(true);
  };

  const imageChanged = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      if (FileReader) {
        if (onImageChanged) onImageChanged(file);
        const fr = new FileReader();
        fr.onload = () => {
          setNewImage(fr.result);
        };
        fr.readAsDataURL(file);
      }
    }
  };

  const imageSrc = newImage
|| (page && page.links && page.links.image ? page.links.image : helpers.defaultPageImage);

  const getZoomActions = () => {
    if (imageSrc && imageSrc !== helpers.defaultPageImage) {
      return [<SpeedDialAction
        key="zoom-in"
        icon={<ZoomInIcon />}
        tooltipTitle={intl.formatMessage({ id: 'action.zoom.in' })}
        onClick={onZoomIn}
      />,
        <SpeedDialAction
          key="zoom-out"
          icon={<ZoomOutIcon />}
          tooltipTitle={intl.formatMessage({ id: 'action.zoom.out' })}
          onClick={onZoomOut}
        />];
    }
    return null;
  };

  const canEdit = createLink || (page && page.links.image_upload);

  return (
    <Box sx={{ flex: 1 }}>
      <img
        alt={page ? page.sequenceNumber : 'new page image'}
        src={imageSrc}
        onError={helpers.setDefaultPageImage}
        style={{ width: `${scale}%` }}
      />
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="raised-button-file"
        multiple
        type="file"
        onChange={imageChanged}
      />
      <SpeedDial
        ariaLabel="image zoom"
        sx={{
          position: 'absolute',
          '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
            bottom: (theme) => theme.spacing(2),
            right: (theme) => theme.spacing(2),
          },
          '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
            top: (theme) => theme.spacing(2),
            left: (theme) => theme.spacing(2),
          },
        }}
        icon={<MoreVertIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={showSpeedDialMenu}
        direction="up"
      >
        { canEdit && (
        <SpeedDialAction
          key="upload"
          component="label"
          htmlFor="raised-button-file"
          icon={<UploadFileIcon />}
          tooltipTitle={intl.formatMessage({ id: 'action.upload' })}
        />
        )}
        {getZoomActions()}
      </SpeedDial>
    </Box>
  );
};

ImageViewer.defaultProps = {
  page: null,
  createLink: null,
  onImageChanged: () => {},
};

ImageViewer.propTypes = {
  page: PropTypes.shape({
    sequenceNumber: PropTypes.number,
    links: PropTypes.shape({
      image: PropTypes.string,
      image_upload: PropTypes.string,
    }),
  }),
  createLink: PropTypes.string,
  onImageChanged: PropTypes.func,
};

export default ImageViewer;
