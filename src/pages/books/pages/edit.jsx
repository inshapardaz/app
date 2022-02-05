import React, { useEffect, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSnackbar } from 'notistack';
import { Helmet } from 'react-helmet';

// MUI
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import ImageIcon from '@mui/icons-material/Image';
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Local Imports
import { libraryService, localeService } from '@/services';
import Editor from '@/components/editor';
import PageBreadcrumb from '@/components/pages/pageBreadcrumb';
import Error from '@/components/error';
import Busy from '@/components/busy';
import ImageViewer from '@/components/pages/imageViewer';
import CompleteButton from '@/components/pages/completeButton';

const PageEditorPage = () => {
  const { bookId, pageNumber } = useParams();
  const history = useHistory();

  const { enqueueSnackbar } = useSnackbar();
  const intl = useIntl();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [book, setBook] = useState(null);
  const [page, setPage] = useState(null);
  const [newCover, setNewCover] = useState(null);
  const [hideImage, setHideImage] = useState(localStorage.getItem('page.editor.hideImage') === 'true');
  const library = useSelector((state) => state.libraryReducer.library);

  const loadBook = () => {
    setBusy(true);
    libraryService.getBookById(library.id, bookId)
      .then((res) => setBook(res))
      .then(() => setBusy(false))
      .catch(() => {
        setError(true);
      })
      .finally(() => setBusy(false));
  };

  const loadData = () => {
    setBusy(true);
    if (pageNumber) {
      libraryService.getPageById(library.id, bookId, pageNumber)
        .then((res) => {
          setPage(res);
          loadBook();
        })
        .catch(() => {
          setError(true);
        })
        .finally(() => setBusy(false));
    }

    if (!book) { loadBook(); }
  };

  useEffect(() => {
    if (library) {
      loadData();
    }
  }, [pageNumber, library]);

  const uploadImage = (res) => {
    if (newCover && res.links && res.links.image_upload) {
      return libraryService.upload(res.links.image_upload, newCover);
    }
    return Promise.resolve();
  };

  const showError = () => {
    setBusy(false);
    enqueueSnackbar(intl.formatMessage({ id: 'pages.messages.error.saving' }), { variant: 'error' });
  };

  const showSuccess = () => {
    setBusy(false);
    enqueueSnackbar(intl.formatMessage({ id: 'pages.messages.saved' }), { variant: 'success' });
    if (page === null) {
      history.goBack();
    }
  };

  const onSave = (newContent) => {
    setBusy(true);
    if (page) {
      page.text = newContent;
      return libraryService.updatePage(page.links.update, page)
        .then((res) => {
          setPage(res);
          return uploadImage(res).then(() => showSuccess(), () => showError());
        }, () => showError());
    }

    const newPage = {
      bookId,
      status: 'Available',
      text: newContent,
      sequenceNumber: book.pageCount + 1,
    };
    return libraryService.createPage(book.links.add_pages, newPage)
      .then((res) => {
        setPage(res);
        return uploadImage(res).then(() => showSuccess(), () => showError());
      }, () => showError());
  };

  const handleImageUpload = (file) => {
    if (file) {
      setNewCover(file);
    }
  };

  const toggleImage = () => {
    localStorage.setItem('page.editor.hideImage', !hideImage);
    setHideImage(!hideImage);
  };

  const hasPreviousLink = () => page && page.links && page.links.previous;
  const hasNextLink = () => page && page.links && page.links.next;

  const pageToolbar = () => (
    <>
      <ButtonGroup variant="outlined" sx={{ mr: (theme) => theme.spacing(1) }}>
        <CompleteButton page={page} onUpdating={setBusy} onUpdated={loadData} />
        <Tooltip title={<FormattedMessage id="page.edit.previous" />}>
          <Button disabled={!hasPreviousLink()} component={Link} to={page ? `/books/${page.bookId}/pages/${page.sequenceNumber - 1}/edit` : ''}>
            { localeService.isRtl() ? <ChevronRightIcon /> : <ChevronLeftIcon /> }
          </Button>
        </Tooltip>
        <Tooltip title={<FormattedMessage id="page.edit.next" />}>
          <Button disabled={!hasNextLink()} component={Link} to={page ? `/books/${page.bookId}/pages/${page.sequenceNumber + 1}/edit` : ''}>
            { localeService.isRtl() ? <ChevronLeftIcon /> : <ChevronRightIcon /> }
          </Button>
        </Tooltip>
      </ButtonGroup>
      <ButtonGroup variant="outlined" sx={{ mr: (theme) => theme.spacing(1) }}>
        <Tooltip title={<FormattedMessage id="action.toggle.image" />}>
          <Button onClick={toggleImage} variant="outlined">
            { hideImage ? <ImageIcon /> : <ImageNotSupportedIcon />}
          </Button>
        </Tooltip>
      </ButtonGroup>

    </>
  );

  const title = !pageNumber ? intl.formatMessage({ id: 'page.editor.header.add' })
    : intl.formatMessage({ id: 'page.editor.header.edit' }, { sequenceNumber: page ? page.sequenceNumber : '' });

  return (
    <Box
      data-ft="edit-page-page"
      sx={{
        backgroundColor: (theme) => theme.palette.background.paper,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Helmet title={title} />
      <Busy busy={busy} />
      <Error error={error} message={<FormattedMessage id="page.messages.error.loading" />}>
        <Editor
          content={page ? page.text : ''}
          identifier={`${bookId}-${page ? page.sequenceNumber : -1}`}
          onSave={onSave}
          label={<PageBreadcrumb book={book} chapter={null} page={page} showPage />}
          endToolbar={pageToolbar()}
          secondaryView={hideImage ? null : (
            <ImageViewer
              page={page}
              createLink={book && book.links.add_pages}
              onImageChanged={handleImageUpload}
            />
          )}
          fullScreen
        />
      </Error>
    </Box>
  );
};

export default PageEditorPage;
