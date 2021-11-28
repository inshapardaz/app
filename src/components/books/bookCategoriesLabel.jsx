import React from 'react';
import PropTypes from 'prop-types';

import { useHistory } from 'react-router-dom';

// MUI
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

// ----------------------------------------------------------

const CategoryPill = ({ category }) => {
  const history = useHistory();
  return (
    <Chip
      size="small"
      variant="outlined"
      label={category.name}
      sx={{ cursor: 'pointer' }}
      onClick={() => history.push(`/books?category=${category.id}`)}
    />
  );
};

CategoryPill.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
};

// --------------------------------------------------------

const BookCategoriesLabel = ({ book, alignPills }) => {
  if (book.categories && book.categories.length > 0) {
    return (
      <Box sx={{ display: 'block', mt: (theme) => theme.spacing(1), textAlign: alignPills }}>
        {book.categories.map((c) => <CategoryPill key={c.id} category={c} />)}
      </Box>
    );
  }
  return null;
};

BookCategoriesLabel.propTypes = {
  book: PropTypes.shape({
    categories: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })),
  }).isRequired,
  alignPills: PropTypes.string.isRequired,
};

export default BookCategoriesLabel;
