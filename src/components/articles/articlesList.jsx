import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// MUI
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import LayersIcon from '@mui/icons-material/Layers';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ClearIcon from '@mui/icons-material/Clear';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import DragHandleIcon from '@mui/icons-material/DragHandle';

// Local import
import { libraryService } from '@/services/';
import Busy from '@/components/busy';
import Error from '@/components/error';
import Empty from '@/components/empty';
import DeleteChapterButton from '@/components/chapters/deleteChapterButton';

const ArticleEditor = ({ createLink, onUpdated, newArticleIndex }) => {
  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [busy, setBusy] = useState(false);
  const [value, setValue] = useState('');

  const onSave = () => {
    setBusy(true);
    libraryService.createArticle(createLink, { title: value, sequenceNumber: newArticleIndex })
      .then(() => enqueueSnackbar(intl.formatMessage({ id: 'chapter.messages.saved' }), { variant: 'success' }))
      .then(() => onUpdated && onUpdated())
      .then(() => setValue(''))
      .catch(() => enqueueSnackbar(intl.formatMessage({ id: 'chapters.messages.error.saving' }), { variant: 'error' }))
      .finally(() => setBusy(false));
  };

  const keyPress = (e) => {
    if (e.keyCode === 13) {
      onSave();
    }
  };

  return (
    <ListItem
      key="new-article"
      divider
      secondaryAction={(
        <>
          <Tooltip title={<FormattedMessage id="action.save" />}>
            <span><IconButton disabled={(busy || value === null || value.trim() === '')} onClick={onSave}><SaveOutlinedIcon /></IconButton></span>
          </Tooltip>
        </>
		)}
    >
      <ListItemIcon>
        <AddCircleOutlineIcon />
      </ListItemIcon>
      <ListItemText primary={(
        <Input
          fullWidth
          disabled={busy}
          variant="standard"
          placeholder={intl.formatMessage({ id: 'chapter.messages.addName' })}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={keyPress}
          endAdornment={value && value.trim() !== '' ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear text"
                onClick={() => setValue('')}
                onMouseDown={() => setValue('')}
                edge="end"
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ) : ''}
        />
        )}
      />
    </ListItem>
  );
};

ArticleEditor.defaultProps = {
  article: null,
  createLink: '',
  onUpdated: () => {},
  newArticleIndex: 0,
};

ArticleEditor.propTypes = {
  article: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    sequenceNumber: PropTypes.number,
  }),
  createLink: PropTypes.string,
  onUpdated: PropTypes.func,
  newArticleIndex: PropTypes.number,
};

// -------------------------------------------------------

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
  onUpdated: () => {},
  onStartEditing: () => {},
  onEndEditing: () => {},
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

// -------------------------------------------------------

const ArticleList = ({ issue }) => {
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState(false);
  const [editing, setEditing] = useState(false);
  const [articles, setArticles] = useState(null);

  const loadData = () => {
    setBusy(true);
    setError(false);

    libraryService.getIssueArticles(issue.links.articles)
      .then((res) => setArticles(res))
      .catch(() => setError(true))
      .finally(() => setBusy(false));
  };

  useEffect(() => {
    if (issue) {
      loadData();
    }
  }, [issue]);

  const onDragDrop = (result) => {
    const fromIndex = result.source.index;
    const toIndex = result.destination.index;
    if (fromIndex !== toIndex) {
      const element = articles.data[fromIndex];
      articles.data.splice(fromIndex, 1);
      articles.data.splice(toIndex, 0, element);

      articles.data = articles.data.map((item, index) => {
        item.chapterNumber = index;
        return item;
      });

      setBusy(true);
      libraryService.setArticleSequence(articles)
        .then((res) => setArticles(res))
        .then(() => setBusy(false))
        .catch(() => {
          setError(true);
        })
        .finally(() => setBusy(false));
    }
  };

  const renderArticles = () => (
    <DragDropContext onDragEnd={onDragDrop}>
      <Droppable droppableId={`Droppable_${issue.issueNumber}`}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <List component="nav" aria-label="main categories">
              <Empty
                items={articles ? articles.data : []}
                message={<FormattedMessage id="chapters.messages.empty" />}
              >
                { articles.data.map((a) => (
                  <ArticleListItem
                    key={a.sequenceNumber}
                    issue={issue}
                    article={a}
                    onUpdated={loadData}
                    canEdit={!editing}
                    onStartEditing={() => setEditing(true)}
                    onEndEditing={() => setEditing(false)}
                  />
                ))}
              </Empty>
              {provided.placeholder}
            </List>
          </div>
        )}
      </Droppable>
      {articles.links.create && (
      <ArticleEditor
        createLink={articles.links.create}
        onUpdated={loadData}
        newIssueIndex={articles.data.length + 1}
      />
      )}
    </DragDropContext>
  );

  return (
    <>
      <Error
        error={error}
        message={<FormattedMessage id="book.messages.error.loading" />}
        actionText={<FormattedMessage id="action.retry" />}
        onAction={loadData}
      >
        <Busy busy={busy} />
        {articles && renderArticles() }
      </Error>
    </>
  );
};

ArticleList.defaultProps = {
  issue: null,
};
ArticleList.propTypes = {
  issue: PropTypes.shape({
    issueNumber: PropTypes.number,
    links: PropTypes.shape({
      articles: PropTypes.string,
    }),
  }),
};

export default ArticleList;
