import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
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
  id, pages, onCheckChanged, onUpdated, selectedPages, type,
}) => {
  const history = useHistory();
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

  const pageClicked = (p) => {
    if (type === 'book') {
      history.push(`/books/${p.bookId}/pages/${p.sequenceNumber}/edit`);
    } else if (type === 'issue') {
      history.push(`/periodicals/${p.bookId}/pages/${p.sequenceNumber}/edit`);
    }
  };

  return (
    <Empty items={pages.data} message={<FormattedMessage id="pages.messages.empty" />}>
      <DragDropContext onDragEnd={onDragDrop}>
        <Droppable droppableId={`Droppable_${id}`}>
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
                    pageClicked={() => pageClicked(p)}
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
  id: null,
  pages: null,
  selectedPages: [],
  onUpdated: () => {},
  onCheckChanged: () => {},
};
PageList.propTypes = {
  id: PropTypes.number,
  pages: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({
      sequenceNumber: PropTypes.number,
    })),
  }),
  selectedPages: PropTypes.arrayOf(PropTypes.number),
  onUpdated: PropTypes.func,
  onCheckChanged: PropTypes.func,
  type: PropTypes.oneOf(['book', 'issue']).isRequired,
};

export default PageList;
