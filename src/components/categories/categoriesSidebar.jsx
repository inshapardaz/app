import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';

// MUI
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CategoryIcon from '@mui/icons-material/Category';

const CategoriesSideBar = ({ selectedCategoryId }) => {
  const history = useHistory();
  const categories = useSelector((state) => state.libraryReducer.categories);

  const renderCategory = (category) => (
    <ListItem disablePadding divider key={category.id}>
      <ListItemButton
        onClick={() => history.push(`/books?category=${category.id}`)}
        selected={category.id === selectedCategoryId}
      >
        <ListItemIcon>
          <CategoryIcon />
        </ListItemIcon>
        <ListItemText primary={category.name} secondary={<FormattedMessage id="categories.item.book.count" values={{ count: category.bookCount }} />} />
      </ListItemButton>
    </ListItem>
  );

  return (
    <List>
      <ListItem disablePadding divider>
        <ListItemButton
          selected={!selectedCategoryId}
          onClick={() => history.push('/books')}
        >
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary={<FormattedMessage id="categories.items.all" />} />
        </ListItemButton>
      </ListItem>
      { categories && categories.data.map((c) => renderCategory(c))}
    </List>
  );
};

CategoriesSideBar.defaultProps = {
  selectedCategoryId: null,
};

CategoriesSideBar.propTypes = {
  selectedCategoryId: PropTypes.number,
};

export default CategoriesSideBar;
