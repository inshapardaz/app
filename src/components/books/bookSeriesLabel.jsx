import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

// MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const BookSeriesLabel = ({ book }) => {
  if (book.seriesName) {
    return (
      <Box sx={{ display: 'block', mt: (theme) => theme.spacing(1) }}>
        <Typography variant="body2">
          { book.seriesIndex
            ? <FormattedMessage id="book.seriesAndIndex" values={{ index: book.seriesIndex, name: (<Link style={{ fontWeight: 'bold' }} to={`/books?series=${book.seriesId}`}>{book.seriesName}</Link>) }} />
            : <FormattedMessage id="book.series" values={{ name: (<Link style={{ fontWeight: 'bold' }} to={`/books?series=${book.seriesId}`}>{book.seriesName}</Link>) }} />}
        </Typography>
      </Box>
    );
  }
  return null;
};

BookSeriesLabel.propTypes = {
  book: PropTypes.shape({
    seriesId: PropTypes.number,
    seriesIndex: PropTypes.number,
    seriesName: PropTypes.string,
  }).isRequired,
};

export default BookSeriesLabel;
