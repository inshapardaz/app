import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

// MUI
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import CategoryIcon from '@mui/icons-material/Category';

// Local Imports
import DeleteCategoryButton from '@/components/categories/deleteCategoryButton';

const CategoryListItem = ({ category }) => {
  const history = useHistory();

  const categoryClicked = () => {
    history.push(`/books?category=${category.id}`);
  };

  return (
    <ListItem
      key={category.id}
      button
      divider
      secondaryAction={(
        <>
          <Tooltip title={<FormattedMessage id="action.edit" />}>
            <IconButton onClick={() => history.push(`/categories/${category.id}/edit`)}><EditIcon /></IconButton>
          </Tooltip>
          <DeleteCategoryButton category={category} />
        </>
)}
    >
      <ListItemIcon onClick={categoryClicked}>
        <CategoryIcon />
      </ListItemIcon>
      <ListItemText
        onClick={categoryClicked}
        primary={category.name}
        secondary={<FormattedMessage id="categories.item.book.count" values={{ count: category.bookCount }} />}
      />
    </ListItem>
  );
};

CategoryListItem.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    bookCount: PropTypes.number,
  }).isRequired,
};

export default CategoryListItem;
