import React from 'react';
import PropTypes from 'prop-types';

import { useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

// MUI
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import DescriptionIcon from '@mui/icons-material/Description';

// Local imports
import helpers from '@/helpers';
import PageStatusIcon from '@/components/pages/pageStatusIcon';
import PageDeleteButton from '@/components/pages/deletePageButton';

const PageImageItem = ({
  page, onUpdated, onCheckChanged, checked,
}) => {
  const history = useHistory();
  const pageClicked = () => history.push(`/books/${page.bookId}/pages/${page.sequenceNumber}/edit`);

  const title = (page.writerAccountId && <FormattedMessage id="page.assignedTo.label" values={{ name: page.writerAccountName }} />);
  return (
    <ImageListItem key={page.sequenceNumber}>
      <img src={page.links.image != null ? page.links.image : helpers.defaultPageImage} alt={page.sequenceNumber} loading="lazy" />
      <ImageListItemBar
        position="top"
        title={(
          <div style={{ color: (theme) => theme.palette.background.paper }}>
            <PageStatusIcon status={page.status} invert />
            <FormattedMessage id="page.editor.header" values={{ sequenceNumber: page.sequenceNumber }} />
            {page.chapterId && <span style={{ padding: '0 10px' }}>•</span>}
            {page.chapterTitle}
          </div>
)}
        sx={{ height: 50, background: (theme) => theme.palette.text.secondary }}
        actionIcon={(
          <Checkbox
            edge="start"
            checked={checked}
            onChange={(e) => onCheckChanged(page.sequenceNumber, e.target.checked)}
            inputProps={{ 'aria-label': 'controlled' }}
            sx={{
              color: (theme) => theme.palette.background.paper,
              '&.Mui-checked': {
                color: (theme) => theme.palette.background.paper,
              },
            }}
          />
)}
      />
      <ImageListItemBar
        title={title}
        sx={{ height: 36, backgroundColor: (theme) => theme.palette.text.secondary }}
        actionIcon={(
          <Toolbar variant="dense">
            <Tooltip title={<FormattedMessage id="action.editContent" />}>
              <IconButton edge="end" aria-label="edit" onClick={pageClicked}>
                <DescriptionIcon style={{ color: 'white' }} fontSize="small" />
              </IconButton>
            </Tooltip>
            <PageDeleteButton
              invert
              page={page}
              onDeleted={onUpdated}
            />
          </Toolbar>
)}
      />
    </ImageListItem>
  );
};

PageImageItem.defaultProps = {
  checked: false,
  onUpdated: () => {},
  onCheckChanged: () => {},
};
PageImageItem.propTypes = {
  page: PropTypes.shape({
    id: PropTypes.number,
    bookId: PropTypes.number,
    sequenceNumber: PropTypes.number,
    writerAccountId: PropTypes.number,
    writerAccountName: PropTypes.string,
    status: PropTypes.string,
    chapterId: PropTypes.number,
    chapterTitle: PropTypes.string,
    links: PropTypes.shape({
      image: PropTypes.string,
      update: PropTypes.string,
    }),
  }).isRequired,
  checked: PropTypes.bool,
  onCheckChanged: PropTypes.func,
  onUpdated: PropTypes.func,
};

export default PageImageItem;
