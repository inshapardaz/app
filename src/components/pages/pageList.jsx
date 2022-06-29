import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

// MUI
import List from '@mui/material/List';

// Local Imports
import Empty from '@/components/empty';
import PageListItem from '@/components/pages/pageListItem';
import { libraryService } from '@/services/';

const PageList = ({
  book, pages, onCheckChanged, onUpdated, selectedPages,
}) => {
  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();

  if (!pages) return null;

  const onDragDrop = (result) => {
    const fromIndex = result.source.index + 1;
    const toIndex = result.destination.index + 1;
    if (fromIndex !== toIndex) {
      const page = pages.data.find((p) => p.sequenceNumber === fromIndex);
      if (page) {
        libraryService.setPagesSequence(page, toIndex)
          .then(onUpdated)
          .then(() => enqueueSnackbar(intl.formatMessage({ id: 'pages.messages.saved' }), { variant: 'success' }))
          .catch(() => enqueueSnackbar(intl.formatMessage({ id: 'pages.messages.error.saving' }), { variant: 'error' }));
      }
    }
  };

  return (
    <Empty items={pages.data} message={<FormattedMessage id="pages.messages.empty" />}>
      <DragDropContext onDragEnd={onDragDrop}>
        <Droppable droppableId={`Droppable_${book.id}`}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <List component="nav" aria-label="authors" sx={{ mx: (theme) => theme.spacing(2) }}>
                {pages.data.map((p) => (
                  <PageListItem
                    key={p.sequenceNumber}
                    page={p}
                    checked={selectedPages.indexOf(p.sequenceNumber) >= 0}
                    onUpdated={onUpdated}
                    onCheckChanged={onCheckChanged}
                  />
                ))}
                {provided.placeholder}
              </List>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Empty>
  );
};

PageList.defaultProps = {
  book: null,
  pages: null,
  selectedPages: [],
  onUpdated: () => {},
  onCheckChanged: () => {},
};
PageList.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.number,
  }),
  pages: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({
      sequenceNumber: PropTypes.number,
    })),
  }),
  selectedPages: PropTypes.arrayOf(PropTypes.number),
  onUpdated: PropTypes.func,
  onCheckChanged: PropTypes.func,
};

export default PageList;
