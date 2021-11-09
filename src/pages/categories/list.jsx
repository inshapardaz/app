import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FormattedMessage, useIntl } from 'react-intl';

// MUI
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import EditIcon from '@mui/icons-material/Edit';
import CategoryIcon from '@mui/icons-material/Category';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// Local Imports

import PageHeader from '@/components/pageHeader';
import Empty from '@/components/empty';
import CenteredContent from '@/components/layout/centeredContent';
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

const CategoriesPage = () => {
  const intl = useIntl();
  const categories = useSelector((state) => state.libraryReducer.categories);

  return (
    <div data-ft="categories-page">
      <Helmet title={intl.formatMessage({ id: 'header.categories' })} />
      <PageHeader title={intl.formatMessage({ id: 'header.categories' })} />
      <CenteredContent>
        {categories && categories.links.create
      && (
      <Toolbar>
        <Button
          data-ft="create-category-button"
          variant="contained"
          color="primary"
          component={Link}
          to="/categories/create"
        >
          <FormattedMessage id="categories.action.create" />
        </Button>
      </Toolbar>
      )}
        <Empty items={categories && categories.data} message={<FormattedMessage id="categories.messages.empty" />}>
          <List component="nav" aria-label="main categories">
            {categories && categories.data.map((c) => (
              <CategoryListItem key={c.id} category={c} />
            ))}
          </List>
        </Empty>
      </CenteredContent>
    </div>
  );
};

export default CategoriesPage;
