import React from 'react';
import PropTypes from 'prop-types';

import { useHistory } from 'react-router-dom';

// MUI
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

// ----------------------------------------------------------

const CategoryPill = ({ category, type }) => {
  const history = useHistory();
  return (
    <Chip
      size="small"
      variant="outlined"
      label={category.name}
      sx={{ cursor: 'pointer' }}
      onClick={() => history.push(`/${type}?category=${category.id}`)}
    />
  );
};

CategoryPill.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }).isRequired,
  type: PropTypes.string.isRequired,
};

// --------------------------------------------------------

const CategoriesLabel = ({ categories, type, alignPills }) => {
  if (categories && categories.length > 0) {
    return (
      <Box sx={{ display: 'block', mt: (theme) => theme.spacing(1), textAlign: alignPills }}>
        {categories.map((c) => <CategoryPill key={c.id} category={c} type={type} />)}
      </Box>
    );
  }
  return null;
};

CategoriesLabel.defaultProps = {
  categories: null,
};

CategoriesLabel.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  })),
  alignPills: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['books', 'periodicals']).isRequired,
};

export default CategoriesLabel;
