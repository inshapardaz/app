import React from 'react';
import {
  Switch, Route, Redirect, useLocation,
} from 'react-router-dom';

// Layouts
import PrivateRoute from './privateRoute';
import FullWidthLayout from './fullWidth.layout';
import NoScrollLayout from './noScroll.layout';
import NoFooterLayout from './noFooter.layout';
import EmptyLayout from './empty.layout';

// Pages
import HomePage from '@/pages/home';
import LoginPage from '@/pages/account/login';
import RegistrationPage from '@/pages/account/register';
import ForgetPasswordPage from '@/pages/account/forgetPassword';
import ResetPasswordPage from '@/pages/account/resetPassword';
import ChangePasswordPage from '@/pages/account/changePassword';
import ProfilePage from '@/pages/account/profile';
import LibrariesPage from '@/pages/admin/libraries';
import LibraryEditPage from '@/pages/admin/libraries/edit';
import LibraryUserPage from '@/pages/admin/libraries/libraryUser';
import LibraryPage from '@/pages/admin/libraries/library';
import CategoriesPage from '@/pages/categories/list';
import UserLibrariesPage from '@/pages/account/libraries';
import CategoryEditPage from '@/pages/categories/edit';
import SeriesPage from '@/pages/series/list';
import SeriesEditPage from '@/pages/series/edit';
import AuthorsPage from '@/pages/authors/list';
import AuthorEditPage from '@/pages/authors/edit';
import AuthorPage from '@/pages/authors/author';
import BooksPage from '@/pages/books/list';
import BookEditPage from '@/pages/books/edit';
import BookPage from '@/pages/books/book';
import BookPages from '@/pages/books/pages/list';
import PageEditorPage from '@/pages/books/pages/edit';
import ChapterContentEditor from '@/pages/chapters/edit';
import ChapterViewer from '@/pages/chapters/view';
import SeriePage from '@/pages/series/serie';
import PeriodicalsPage from '@/pages/periodicals';
import PeriodicalEditPage from '@/pages/periodicals/edit';
import IssuesPage from '@/pages/periodicals/issues';
import IssuesEditPage from '@/pages/periodicals/issues/edit';
import UserPages from '@/pages/account/userPages';
import CorrectionsListPage from '@/pages/tools/corrections';
import CorrectionEditPage from '@/pages/tools/corrections/edit';

import Error403 from '@/pages/error/403';
import Error404 from '@/pages/error/404';
import Error500 from '@/pages/error/500';

const Routes = () => {
  const { pathname } = useLocation();

  return (
    <Switch>
      <Route path="/account/login"><LoginPage /></Route>
      <Route path="/account/register"><RegistrationPage /></Route>
      <Route path="/account/forgot-password"><ForgetPasswordPage /></Route>
      <Route path="/account/reset-password"><ResetPasswordPage /></Route>
      <PrivateRoute layout={EmptyLayout} path="/account/change-password" component={ChangePasswordPage} />
      <PrivateRoute layout={EmptyLayout} path="/account/libraries" component={UserLibrariesPage} />
      <PrivateRoute layout={FullWidthLayout} path="/profile" component={ProfilePage} exact />
      <PrivateRoute layout={FullWidthLayout} path="/profile/pages" component={UserPages} exact />
      <PrivateRoute layout={FullWidthLayout} path="/admin/libraries/:libraryId/edit" component={LibraryEditPage} adminOnly exact />
      <PrivateRoute layout={FullWidthLayout} path="/admin/libraries/create" component={LibraryEditPage} adminOnly exact />
      <PrivateRoute layout={FullWidthLayout} path="/admin/libraries/:libraryId/users/:userId/edit" component={LibraryUserPage} adminOnly exact />
      <PrivateRoute layout={FullWidthLayout} path="/admin/libraries/:libraryId/users/add" component={LibraryUserPage} adminOnly exact />
      <PrivateRoute layout={FullWidthLayout} path="/admin/libraries/:libraryId" component={LibraryPage} adminOnly exact />
      <PrivateRoute layout={FullWidthLayout} path="/admin/libraries" component={LibrariesPage} adminOnly exact />
      <PrivateRoute layout={FullWidthLayout} path="/categories" component={CategoriesPage} exact />
      <PrivateRoute layout={FullWidthLayout} path="/categories/create" component={CategoryEditPage} exact />
      <PrivateRoute layout={FullWidthLayout} path="/categories/:categoryId/edit" component={CategoryEditPage} exact />
      <PrivateRoute layout={FullWidthLayout} path="/series" component={SeriesPage} exact />
      <PrivateRoute layout={FullWidthLayout} path="/series/create" component={SeriesEditPage} exact />
      <PrivateRoute layout={FullWidthLayout} path="/series/:seriesId/edit" component={SeriesEditPage} exact />
      <PrivateRoute layout={FullWidthLayout} path="/series/:seriesId" component={SeriePage} exact />
      <PrivateRoute layout={FullWidthLayout} path="/authors" component={AuthorsPage} exact />
      <PrivateRoute layout={FullWidthLayout} path="/authors/create" component={AuthorEditPage} exact />
      <PrivateRoute layout={FullWidthLayout} path="/authors/:authorId/edit" component={AuthorEditPage} exact />
      <PrivateRoute layout={FullWidthLayout} path="/authors/:authorId" component={AuthorPage} exact />
      <PrivateRoute layout={FullWidthLayout} path="/books" component={BooksPage} exact />
      <PrivateRoute layout={FullWidthLayout} path="/books/create" component={BookEditPage} exact />
      <PrivateRoute layout={FullWidthLayout} path="/books/:bookId" component={BookPage} exact />
      <PrivateRoute layout={FullWidthLayout} path="/books/:bookId/edit" component={BookEditPage} exact />
      <PrivateRoute layout={NoScrollLayout} path="/books/:bookId/pages/:pageNumber/edit" component={PageEditorPage} exact />
      <PrivateRoute layout={NoScrollLayout} path="/books/:bookId/pages/create" component={PageEditorPage} exact />
      <PrivateRoute layout={FullWidthLayout} path="/books/:bookId/pages" component={BookPages} exact />
      <PrivateRoute layout={NoFooterLayout} path="/books/:bookId/chapters/:chapterNumber" component={ChapterViewer} exact />
      <PrivateRoute layout={FullWidthLayout} path="/books/:bookId/chapters/:chapterNumber/edit" component={ChapterContentEditor} exact />
      <PrivateRoute layout={FullWidthLayout} path="/periodicals/create" component={PeriodicalEditPage} exact libraryWithPeriodicals />
      <PrivateRoute layout={FullWidthLayout} path="/periodicals/:id/edit" component={PeriodicalEditPage} exact libraryWithPeriodicals />
      <PrivateRoute layout={FullWidthLayout} path="/periodicals/:periodicalId/issues/:issueId/edit" component={IssuesEditPage} exact libraryWithPeriodicals />
      <PrivateRoute layout={FullWidthLayout} path="/periodicals/:periodicalId/issues/create" component={IssuesEditPage} exact libraryWithPeriodicals />
      <PrivateRoute layout={FullWidthLayout} path="/periodicals/:id/issues" component={IssuesPage} exact libraryWithPeriodicals />
      <PrivateRoute layout={FullWidthLayout} path="/periodicals" component={PeriodicalsPage} exact libraryWithPeriodicals />
      <PrivateRoute layout={FullWidthLayout} path="/tools/corrections/:language/:profile/add" component={CorrectionEditPage} exact />
      <PrivateRoute layout={FullWidthLayout} path="/tools/corrections/:language/:profile/:id/edit" component={CorrectionEditPage} exact />
      <PrivateRoute layout={FullWidthLayout} path="/tools/corrections/:language?/:profile?" component={CorrectionsListPage} exact />
      <Redirect from="/:url*(/+)" to={pathname.slice(0, -1)} />
      <Route path="/error/403"><Error403 /></Route>
      <Route path="/error/404"><Error404 /></Route>
      <Route path="/error/500"><Error500 /></Route>
      <PrivateRoute layout={FullWidthLayout} path="/" component={HomePage} />
    </Switch>
  );
};

export default Routes;
