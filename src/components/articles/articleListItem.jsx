import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Draggable } from 'react-beautiful-dnd';

// MUI
import Input from '@mui/material/Input';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import LayersIcon from '@mui/icons-material/Layers';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import DragHandleIcon from '@mui/icons-material/DragHandle';

// Local import
import { libraryService } from '@/services/';
import DeleteChapterButton from '@/components/chapters/deleteChapterButton';

const ArticleListItem = ({
  issue, article, onUpdated, onStartEditing, onEndEditing, canEdit,
}) => {
  const intl = useIntl();
  const [editing, setEditing] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [busy, setBusy] = useState(false);
  const [value, setValue] = useState('');

  const startEditing = () => {
    setValue(article.title);
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
      sequenceNumber: article.sequenceNumber,
    };
    libraryService.updateArticle(article.links.update, obj)
      .then(() => enqueueSnackbar(intl.formatMessage({ id: 'chapter.messages.saved' }), { variant: 'success' }))
      .then(() => onUpdated && onUpdated())
      .then(() => endEditing())
      .catch(() => enqueueSnackbar(intl.formatMessage({ id: 'chapters.messages.error.saving' }), { variant: 'error' }))
      .finally(() => setBusy(false));
  };

  const keyPress = (e) => {
    if (e.keyCode === 13) {
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
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={keyPress}
          sx={{ marginRight: '80px' }}
        />
      );
    }

    return <Link to={`/periodicals/${issue.periodicalId}/issue/${issue.issueNumber}/articles/${article.sequenceNumber}`} style={{ display: 'block', marginTop: '2px', marginBottom: '6px' }}>{article.title}</Link>;
  };

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

    if (article.links.update) {
      return (
        <>
          <Tooltip title={<FormattedMessage id="chapter.action.editContent" />}>
            <span>
              <IconButton
                component={Link}
                to={`/periodicals/${issue.periodicalId}/issue/${issue.issueNumber}/articles/${article.sequenceNumber}/edit`}
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
          <DeleteChapterButton
            menuItem={false}
            chapter={article}
            onDeleted={onUpdated}
            disabled={!canEdit}
          />
        </>
      );
    }

    return null;
  };

  return (
    <Draggable isDragDisabled={!canEdit} draggableId={`draggable-${article.id}`} index={article.sequenceNumber}>
      {(provided) => (
        <ListItem
          key={article.id}
          disableRipple
          button
          divider
          secondaryAction={renderActions()}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {canEdit && (
          <ListItemIcon>
            <DragHandleIcon />
          </ListItemIcon>
          )}
          <ListItemIcon>
            <LayersIcon />
          </ListItemIcon>
          <ListItemText
            primary={renderPrimary()}
          />
        </ListItem>
      )}
    </Draggable>
  );
};
ArticleListItem.defaultProps = {
  onUpdated: () => { },
  onStartEditing: () => { },
  onEndEditing: () => { },
  canEdit: false,
};

ArticleListItem.propTypes = {
  issue: PropTypes.shape({
    periodicalId: PropTypes.number.isRequired,
    issueNumber: PropTypes.number.isRequired,
    volumeNumber: PropTypes.number.isRequired,
  }).isRequired,
  article: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    sequenceNumber: PropTypes.number,
    links: PropTypes.shape({
      update: PropTypes.string,
    }),
  }).isRequired,
  canEdit: PropTypes.bool,
  onStartEditing: PropTypes.func,
  onEndEditing: PropTypes.func,
  onUpdated: PropTypes.func,
};

export default ArticleListItem;
