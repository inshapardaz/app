import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FormattedMessage, useIntl } from 'react-intl';

// MUI
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';

import List from '@mui/material/List';

// Local Imports
import PageHeader from '@/components/pageHeader';
import CategoryListItem from '@/components/categories/categoryListItem';
import Empty from '@/components/empty';
import CenteredContent from '@/components/layout/centeredContent';

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
