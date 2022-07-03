import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Helmet } from 'react-helmet';
import { FormattedMessage, useIntl } from 'react-intl';

// MUI
import Alert from '@mui/material/Alert';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

// Local Imports
import { libraryService, localeService } from '@/services';
import Busy from '@/components/busy';
import Error from '@/components/error';
import Editor from '@/components/editor';
import ChapterBreadcrumb from '@/components/chapters/chapterBreadcrumb';
import ChapterStatusButton from '@/components/chapters/chapterStatusButton';
import ChapterAssignButton from '@/components/chapters/chapterAssignButton';

const ChapterContentEditor = () => {
  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const { bookId, chapterNumber } = useParams();
  const [book, setBook] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [content, setContent] = useState('');
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState(false);
  const library = useSelector((state) => state.libraryReducer.library);

  const loadChapterContent = () => {
    setBusy(true);
    libraryService.getChapterContents(library.id, bookId, chapterNumber, library.language)
      .then((data) => {
        setContent(data);
        setDirty(false);
      })
      .catch((e) => {
        if (e.status === 404) {
          setContent(null);
        } else {
          console.error(e);
          enqueueSnackbar(intl.formatMessage({ id: 'chapter.messages.error.loading' }), { variant: 'error' });
        }
      })
      .finally(() => setBusy(false));
  };

  const loadChapter = () => {
    libraryService.getChapterById(library.id, bookId, chapterNumber)
      .then((res) => setChapter(res))
      .then(() => loadChapterContent())
      .catch((e) => {
        console.error(e);
        setBusy(false);
        setError(true);
      })
      .finally(() => setBusy(false));
  };

  const loadData = () => {
    setBusy(true);
    setError(false);
    libraryService.getBookById(library.id, bookId)
      .then((res) => setBook(res))
      .then(() => loadChapter())
      .catch((e) => {
        console.error(e);
        setError(true);
      })
      .finally(() => setBusy(false));
  };

  useEffect(() => {
    if (bookId && chapterNumber && library) {
      loadData();
    }
  }, [bookId, chapterNumber, library]);

  const saveContents = (newContent) => {
    setBusy(true);
    if (content == null) {
      //  Adding new content
      return libraryService.addChapterContents(chapter.links.add_content,
        library.language, newContent)
        .then((res) => {
          setContent(res);
          enqueueSnackbar(intl.formatMessage({ id: 'chapter.messages.saved' }), { variant: 'success' });
        })
        .catch(() => enqueueSnackbar(intl.formatMessage({ id: 'chapter.messages.error.saving' }), { variant: 'error' }))
        .finally(() => {
          setBusy(false);
          setDirty(false);
        });
    }
    // Updating new content
    return libraryService.updateChapterContents(content.links.update,
      library.language, newContent)
      .then(() => {
        enqueueSnackbar(intl.formatMessage({ id: 'chapter.messages.saved' }), { variant: 'success' });
      })
      .catch(() => enqueueSnackbar(intl.formatMessage({ id: 'chapter.messages.error.saving' }), { variant: 'error' }))
      .finally(() => {
        setBusy(false);
        setDirty(false);
      });
  };

  const getDirection = () => {
    if (content) {
      return localeService.getDirection(content.language);
    }

    return library ? localeService.getDirection(library.language) : 'ltr';
  };

  const onChanged = (d) => {
    setDirty(d);
  };

  const hasPreviousLink = () => chapter && chapter.links && chapter.links.previous;
  const hasNextLink = () => chapter && chapter.links && chapter.links.next;

  const renderEndToolBar = () => (
    <ButtonGroup>
      <ChapterStatusButton chapter={chapter} button />
      <ChapterAssignButton chapter={chapter} button onAssigning={() => setBusy(true)} onAssigned={() => setBusy(false)} />
      <Tooltip title={<FormattedMessage id="page.edit.previous" />}>
        <Button
          disabled={!hasPreviousLink()}
          component={Link}
          to={chapter ? `/books/${chapter.bookId}/chapters/${chapter.chapterNumber - 1}/edit` : ''}
        >
          { localeService.isRtl() ? <ChevronRightIcon /> : <ChevronLeftIcon /> }
        </Button>
      </Tooltip>
      <Tooltip title={<FormattedMessage id="page.edit.previous" />}>
        <Button
          disabled={!hasNextLink()}
          component={Link}
          to={chapter ? `/books/${chapter.bookId}/chapters/${chapter.chapterNumber + 1}/edit` : ''}
        >
          { localeService.isRtl() ? <ChevronLeftIcon /> : <ChevronRightIcon /> }
        </Button>
      </Tooltip>
    </ButtonGroup>
  );

  const renderChapterEditor = () => {
    if (!chapter) {
      return null;
    }

    return (
      <Editor
        content={content ? content.text : null}
        label={<ChapterBreadcrumb book={book} chapter={chapter} />}
        message={!busy && content === null && (
        <Alert severity="warning">
          <FormattedMessage id="chapter.messages.addingContent" />
        </Alert>
        )}
        endToolbar={renderEndToolBar()}
        identifier={`${book.id}-${chapter.id}-${library.language}`}
        onSave={saveContents}
        onDirty={onChanged}
        direction={getDirection()}
      />
    );
  };
  return (
    <div data-ft="edit-book-page">
      <Helmet title={chapter ? chapter.title : ''} />
      {/* <Prompt
        when={dirty}
        message={intl.formatMessage({ id: 'chapter.messages.unsavedText' })}
      /> */}
      <Error
        error={error}
        message={<FormattedMessage id="chapter.messages.error.loading" />}
        actionText={<FormattedMessage id="action.retry" />}
        onAction={loadData}
      >
        <Busy busy={busy} />
        { renderChapterEditor()}
      </Error>
    </div>
  );
};

export default ChapterContentEditor;
