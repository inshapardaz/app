import React from 'react';
import PropTypes from 'prop-types';

import { useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { Draggable } from 'react-beautiful-dnd';

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
import KeyboardOutlinedIcon from '@mui/icons-material/KeyboardOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import DragHandleIcon from '@mui/icons-material/DragHandle';

// Local imports
import PageDeleteButton from '@/components/pages/deletePageButton';
import PageStatusIcon from '@/components/pages/pageStatusIcon';
import IconWithTooltip from '@/components/iconWithTooltip';

const PageListItem = ({
  page, onUpdated, onCheckChanged, checked,
}) => {
  const history = useHistory();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const pageClicked = () => history.push(`/books/${page.bookId}/pages/${page.sequenceNumber}/edit`);
  const canReorder = page.links && page.links.page_sequence !== null;
  const assignments = (
    <>
      {page.writerAccountId && (
      <IconWithTooltip
        tooltip={<FormattedMessage id="page.assignedTo.typing.label" values={{ name: page.writerAccountName }} />}
        icon={<KeyboardOutlinedIcon />}
        text={page.writerAccountName}
      />
      )}
      {page.reviewerAccountId && (
      <IconWithTooltip
        tooltip={<FormattedMessage id="page.assignedTo.proofReading.label" values={{ name: page.reviewerAccountName }} />}
        icon={<RateReviewOutlinedIcon />}
        text={page.reviewerAccountName}
      />
      )}
    </>
  );
  const actions = (
    <>
      { matches ? assignments : null }
      <Tooltip title={<FormattedMessage id="action.edit" />}>
        <IconButton onClick={pageClicked}><EditIcon /></IconButton>
      </Tooltip>
      <PageDeleteButton page={page} onDeleted={onUpdated} />
    </>
  );
  return (
    <Draggable isDragDisabled={!canReorder} draggableId={`draggable-${page.bookId}-${page.sequenceNumber}`} index={page.sequenceNumber - 1}>
      {(provided) => (
        <ListItem
          divider
          disablePadding
          secondaryAction={actions}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          {canReorder && (
          <ListItemIcon {...provided.dragHandleProps}>
            <DragHandleIcon />
          </ListItemIcon>
          )}
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
            primary={(
              <>
                <FormattedMessage id="page.editor.header" values={{ sequenceNumber: page.sequenceNumber }} />
                {page.chapterId
            && (
            <>
              <span style={{ padding: '0 10px', color: theme.palette.text.secondary }}>•</span>
              <Typography component="span" sx={{ color: theme.palette.text.secondary }}>
                {page.chapterTitle}
              </Typography>
            </>
            )}
              </>
        )}
            secondary={matches ? null : assignments}
          />
        </ListItem>
      )}
    </Draggable>
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
      page_sequence: PropTypes.string,
    }),
  }).isRequired,
  checked: PropTypes.bool,
  onCheckChanged: PropTypes.func,
  onUpdated: PropTypes.func,
};

export default PageListItem;
