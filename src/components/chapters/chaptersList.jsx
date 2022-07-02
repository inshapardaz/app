import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

// MUI
import List from '@mui/material/List';

// Local import
import { libraryService } from '@/services/';
import Busy from '@/components/busy';
import Error from '@/components/error';
import Empty from '@/components/empty';
import ChapterEditor from '@/components/chapters/chapterEditor';
import ChapterListItem from '@/components/chapters/chapterListItem';

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
        item.chapterNumber = index + 1;
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
                    onUpdated={() => loadData()}
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
