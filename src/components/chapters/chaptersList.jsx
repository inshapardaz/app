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

const ChapterEditor = ({ createLink, onUpdated, newChapterIndex }) => {
  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const [busy, setBusy] = useState(false);
  const [value, setValue] = useState('');

  const onSave = () => {
    setBusy(true);
    libraryService.createChapter(createLink, { title: value, chapterNumber: newChapterIndex })
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
      key="new-chapter"
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

ChapterEditor.defaultProps = {
  chapter: null,
  createLink: '',
  onUpdated: () => {},
  newChapterIndex: 0,
};

ChapterEditor.propTypes = {
  chapter: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    bookId: PropTypes.number,
  }),
  createLink: PropTypes.string,
  onUpdated: PropTypes.func,
  newChapterIndex: PropTypes.number,
};

// -------------------------------------------------------

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

    return <Link to={`/books/${chapter.bookId}/chapters/${chapter.chapterNumber}`} style={{ display: 'block', marginTop: '2px', marginBottom: '6px' }}>{chapter.title}</Link>;
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

    if (chapter.links.update) {
      return (
        <>
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
          <DeleteChapterButton
            chapter={chapter}
            onDeleted={onUpdated}
            disabled={!canEdit}
          />
        </>
      );
    }

    return null;
  };

  return (
    <Draggable isDragDisabled={!canEdit} draggableId={`draggable-${chapter.id}`} index={chapter.chapterNumber}>
      {(provided) => (
        <ListItem
          key={chapter.id}
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

const ChaptersList = ({ book }) => {
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState(false);
  const [editing, setEditing] = useState(false);
  const [chapters, setChapters] = useState(null);

  const loadData = () => {
    setBusy(true);
    setError(false);

    libraryService.getBookChapters(book.links.chapters)
      .then((res) => setChapters(res))
      .then(() => setBusy(false))
      .catch(() => {
        setBusy(false);
        setError(true);
      });
  };

  useEffect(() => {
    if (book) {
      loadData();
    }
  }, [book]);

  const onDragDrop = (result) => {
    const fromIndex = result.source.index;
    const toIndex = result.destination.index;
    if (fromIndex !== toIndex) {
      const element = chapters.data[fromIndex];
      chapters.data.splice(fromIndex, 1);
      chapters.data.splice(toIndex, 0, element);

      chapters.data = chapters.data.map((item, index) => {
        item.chapterNumber = index;
        return item;
      });

      setBusy(true);
      libraryService.setChapterSequence(chapters)
        .then((res) => setChapters(res))
        .then(() => setBusy(false))
        .catch(() => {
          setError(true);
        })
        .finally(() => setBusy(false));
    }
  };

  const renderChapters = () => (
    <DragDropContext onDragEnd={onDragDrop}>
      <Droppable droppableId={`Droppable_${book.id}`}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <List component="nav" aria-label="main categories">
              <Empty
                items={chapters ? chapters.data : []}
                message={<FormattedMessage id="chapters.messages.empty" />}
              >
                { chapters.data.map((c) => (
                  <ChapterListItem
                    key={c.id}
                    chapter={c}
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
      {chapters.links.create && (
      <ChapterEditor
        createLink={chapters.links.create}
        onUpdated={loadData}
        newChapterIndex={chapters.data.length + 1}
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
        {chapters && renderChapters() }
      </Error>
    </>
  );
};

ChaptersList.defaultProps = {
  book: null,
};
ChaptersList.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.number,
    links: PropTypes.shape({
      chapters: PropTypes.string,
    }),
  }),
};

export default ChaptersList;
