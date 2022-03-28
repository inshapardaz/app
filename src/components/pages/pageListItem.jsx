import React from 'react';
import PropTypes from 'prop-types';

import { useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

// MUI
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';

// Local imports
import PageDeleteButton from '@/components/pages/deletePageButton';
import PageStatusIcon from '@/components/pages/pageStatusIcon';

const PageListItem = ({
  page, onUpdated, onCheckChanged, checked,
}) => {
  const history = useHistory();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const pageClicked = () => history.push(`/books/${page.bookId}/pages/${page.sequenceNumber}/edit`);

  return (
    <ListItem
      divider
      disablePadding
      secondaryAction={(
        <>
          <Tooltip title={<FormattedMessage id="action.edit" />}>
            <IconButton onClick={pageClicked}><EditIcon /></IconButton>
          </Tooltip>
          <PageDeleteButton page={page} onDeleted={onUpdated} />
        </>
)}
    >
      <Checkbox
        edge="start"
        checked={checked}
        onClick={() => onCheckChanged(page.sequenceNumber, !checked)}
        tabIndex={-1}
        disableRipple
      />
      {matches && (
        <ListItemIcon onClick={pageClicked} sx={{ mr: theme.spacing(1) }}>
          <PageStatusIcon status={page.status} />
        </ListItemIcon>
      )}
      <ListItemText
        onClick={pageClicked}
        sx={{ cursor: 'pointer' }}
        primary={<FormattedMessage id="page.editor.header" values={{ sequenceNumber: page.sequenceNumber }} />}
        secondary={(
          <>
            {page.chapterId
            && (
            <Typography component="span">
              {page.chapterTitle}
            </Typography>
            )}
            {page.chapterId && page.writerAccountId && <span style={{ padding: '0 10px' }}>•</span>}
            {page.writerAccountId
            && <FormattedMessage id="page.assignedTo.typing.label" values={{ name: page.writerAccountName }} />}
            {(page.chapterId || page.writerAccountId) && page.reviewerAccountId && <span style={{ padding: '0 10px' }}>•</span>}
            {page.reviewerAccountId
            && <FormattedMessage id="page.assignedTo.proofReading.label" values={{ name: page.reviewerAccountName }} />}
          </>
        )}
      />
    </ListItem>
  );
};

PageListItem.defaultProps = {
  checked: false,
  onUpdated: () => {},
  onCheckChanged: () => {},
};
PageListItem.propTypes = {
  page: PropTypes.shape({
    id: PropTypes.number,
    bookId: PropTypes.number,
    sequenceNumber: PropTypes.number,
    writerAccountId: PropTypes.number,
    writerAccountName: PropTypes.string,
    reviewerAccountId: PropTypes.number,
    reviewerAccountName: PropTypes.string,
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

export default PageListItem;
