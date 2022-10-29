import React from 'react';
import PropTypes from 'prop-types';

// MUI
import Typography from '@mui/material/Typography';

const BookFiles = (book) => (<Typography variant="h1" color="initial">No books available</Typography>);

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
