import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd';

// MUI
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import KeyboardOutlinedIcon from '@mui/icons-material/KeyboardOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DragHandleIcon from '@mui/icons-material/DragHandle';

import Menu from '@mui/material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// Local Imports
import { libraryService } from '@/services/';
import DeleteChapterButton from '@/components/chapters/deleteChapterButton';
import AssignToMeButton from '@/components/chapters/assignToMeButton';
import ChapterAssignButton from '@/components/chapters/chapterAssignButton';
import ChapterStatusButton from '@/components/chapters/chapterStatusButton';
import PageStatusIcon from '@/components/pages/pageStatusIcon';
import IconWithTooltip from '@/components/iconWithTooltip';

const ChapterMenu = ({ chapter, canEdit, onUpdated }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="more"
        id="chapter-menu-button"
        aria-controls={open ? 'chapter-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="chapter-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <AssignToMeButton chapter={chapter} onAssigned={onUpdated} />
        <ChapterAssignButton chapter={chapter} onAssigned={onUpdated} onClose={handleClose} />
        <ChapterStatusButton chapter={chapter} onUpdated={onUpdated} onClose={handleClose} />
        <Divider />
        <DeleteChapterButton
          chapter={chapter}
          onDeleted={onUpdated}
          disabled={!canEdit}
        />
      </Menu>
    </>
  );
};

ChapterMenu.defaultProps = {
  canEdit: false,
  onUpdated: () => {},
};

ChapterMenu.propTypes = {
  chapter: PropTypes.shape({
    title: PropTypes.string,
    links: PropTypes.shape({
      update: PropTypes.string,
    }),
  }).isRequired,
  canEdit: PropTypes.bool,
  onUpdated: PropTypes.func,
};

const ChapterListItem = ({
  chapter, onUpdated, onStartEditing, onEndEditing, canEdit,
}) => {
  const intl = useIntl();
  const [editing, setEditing] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [busy, setBusy] = useState(false);
  const [value, setValue] = useState('');

  const startEditing = () => {
    setValue(chapter.title);
    setEditing(true);
    onStartEditing();
  };

  const endEditing = () => {
    setValue('');
    setEditing(false);
    onEndEditing();
  };

  const onSave = () => {
    setBusy(true);
    const obj = {
      title: value,
      bookId: chapter.bookId,
      chapterNumber: chapter.chapterNumber,
    };

    libraryService.updateChapter(chapter.links.update, obj)
      .then(() => enqueueSnackbar(intl.formatMessage({ id: 'chapter.messages.saved' }), { variant: 'success' }))
      .then(() => onUpdated && onUpdated())
      .then(() => endEditing())
      .catch(() => enqueueSnackbar(intl.formatMessage({ id: 'chapters.messages.error.saving' }), { variant: 'error' }))
      .finally(() => setBusy(false));
  };

  const keyPress = (e) => {
    if (e !== null && e.keyCode === 13) {
      onSave();
    }
  };

  const renderPrimary = () => {
    if (editing) {
      return (
        <Input
          autoFocus
          fullWidth
          disabled={busy}
          variant="standard"
          placeholder={intl.formatMessage({ id: 'chapter.messages.addName' })}
          value={value}
          onChange={(e) => e !== null && setValue(e.target.value)}
          onKeyDown={keyPress}
          sx={{ marginRight: '80px' }}
        />
      );
    }

    return <Link to={`/books/${chapter.bookId}/chapters/${chapter.chapterNumber}`} style={{ display: 'block', marginTop: '2px', marginBottom: '6px' }}>{chapter.title}</Link>;
  };

  const assignments = (
    <>
      {chapter.writerAccountId && (
      <IconWithTooltip
        tooltip={<FormattedMessage id="page.assignedTo.typing.label" values={{ name: chapter.writerAccountName }} />}
        icon={<KeyboardOutlinedIcon />}
        text={chapter.writerAccountName}
      />
      )}
      {chapter.reviewerAccountId && (
      <IconWithTooltip
        tooltip={<FormattedMessage id="page.assignedTo.proofReading.label" values={{ name: chapter.reviewerAccountName }} />}
        icon={<RateReviewOutlinedIcon />}
        text={chapter.reviewerAccountName}
      />
      )}
    </>
  );

  const renderActions = () => {
    if (editing) {
      return (
        <>
          <Tooltip title={<FormattedMessage id="action.save" />}>
            <span><IconButton disabled={(busy || value === null || value.trim() === '')} onClick={onSave}><SaveOutlinedIcon /></IconButton></span>
          </Tooltip>
          <Tooltip title={<FormattedMessage id="action.cancel" />}>
            <IconButton
              aria-label="stop editing"
              onClick={endEditing}
              onMouseDown={endEditing}
              edge="end"
            >
              <CancelOutlinedIcon />
            </IconButton>
          </Tooltip>
        </>
      );
    }

    if (chapter.links.update) {
      return (
        <>
          { assignments }
          <Tooltip title={<FormattedMessage id="chapter.action.editContent" />}>
            <span>
              <IconButton
                component={Link}
                to={`/books/${chapter.bookId}/chapters/${chapter.chapterNumber}/edit`}
                disabled={!canEdit}
              >
                <DescriptionOutlinedIcon />
              </IconButton>

            </span>
          </Tooltip>
          <Tooltip title={<FormattedMessage id="action.edit" />}>
            <span>
              <IconButton
                onClick={startEditing}
                disabled={!canEdit}
              >
                <EditOutlinedIcon />
              </IconButton>

            </span>
          </Tooltip>
          <ChapterMenu chapter={chapter} canEdit={canEdit} onUpdated={onUpdated} />
        </>
      );
    }

    return null;
  };

  return (
    <Draggable isDragDisabled={!canEdit} draggableId={`draggable-${chapter.id}`} index={chapter.chapterNumber - 1}>
      {(provided) => (
        <ListItem
          key={chapter.id}
          disableRipple
          button
          divider
          secondaryAction={renderActions()}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          {canEdit && (
          <ListItemIcon {...provided.dragHandleProps}>
            <DragHandleIcon />
          </ListItemIcon>
          )}
          <ListItemIcon>
            <PageStatusIcon status={chapter.status} />
          </ListItemIcon>
          <ListItemText
            primary={renderPrimary()}
          />
        </ListItem>
      )}
    </Draggable>
  );
};

ChapterListItem.defaultProps = {
  onUpdated: () => {},
  onStartEditing: () => {},
  onEndEditing: () => {},
  canEdit: false,
};

ChapterListItem.propTypes = {
  chapter: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    bookId: PropTypes.number,
    chapterNumber: PropTypes.number,
    writerAccountId: PropTypes.number,
    writerAccountName: PropTypes.string,
    reviewerAccountId: PropTypes.number,
    reviewerAccountName: PropTypes.string,
    status: PropTypes.string,
    links: PropTypes.shape({
      update: PropTypes.string,
    }),
  }).isRequired,
  canEdit: PropTypes.bool,
  onStartEditing: PropTypes.func,
  onEndEditing: PropTypes.func,
  onUpdated: PropTypes.func,
};

export default ChapterListItem;
