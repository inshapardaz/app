import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import queryString from 'query-string';

// MUI
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';

// Local Imports
import PageHeader from '@/components/pageHeader';
import CenteredContent from '@/components/layout/centeredContent';
import CategoriesSideBar from '@/components/categories/categoriesSidebar';
import BookList from '@/components/books/bookList';

const BooksPage = () => {
  const intl = useIntl();
  const location = useLocation();
  const library = useSelector((state) => state.libraryReducer.library);
  const theme = useTheme();
  const isAboveSmall = useMediaQuery(theme.breakpoints.up('md'));

  const [category, setCategory] = useState(null);
  const [series, setSeries] = useState(null);
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    const values = queryString.parse(location.search);
    if (values.series) { setSeries(parseInt(values.series, 10)); } else { setSeries(null); }
    if (values.author) { setAuthor(parseInt(values.author, 10)); } else { setAuthor(null); }
    if (values.category) { setCategory(parseInt(values.category, 10)); } else { setCategory(null); }
  }, [location]);

  return (
    <div data-ft="books-page">
      <Helmet title={intl.formatMessage({ id: 'header.books' })} />
      <PageHeader title={intl.formatMessage({ id: 'header.books' })} />
      <CenteredContent>
        <Grid container spacing={2} direction={isAboveSmall ? 'row' : 'column-reverse'}>
          <Grid item md={2}>
            <CategoriesSideBar selectedCategoryId={category} />
          </Grid>
          <Grid item md={10}>
            <BookList library={library} series={series} author={author} category={category} />
          </Grid>
        </Grid>
      </CenteredContent>
    </div>
  );
};

export default BooksPage;
