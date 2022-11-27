import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

// MUI

// Local Imports
import EmptyPlaceholder from '../emptyPlaceHolder';

const BookFiles = (book) => {
  const intl = useIntl();
  return (
    <EmptyPlaceholder
      title={intl.formatMessage({ id: 'book.tabs.files.messages.empty' })}
      actionText={intl.formatMessage({ id: 'book.tabs.files.label.add' })}
      onAction={() => console.log('upload file')}
    />
  );
};

BookFiles.defaultProps = {
  book: null,
};

BookFiles.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    authors: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })),
    categories: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })),
    status: PropTypes.string,
    links: PropTypes.shape({
      image: PropTypes.string,
      update: PropTypes.string,
      delete: PropTypes.string,
    }),
  }),
};

export default BookFiles;
