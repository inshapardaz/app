import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Helmet } from 'react-helmet';
import { FormattedMessage, useIntl } from 'react-intl';

import Alert from '@mui/material/Alert';

// Local Imports
import { libraryService } from '@/services/';
import Busy from '@/components/busy';
import Error from '@/components/error';
import Editor from '@/components/editor';
import ChapterBreadcrumb from '@/components/chapters/chapterBreadcrumb';

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
        console.error(e);
        if (e.status === 404) {
          setContent(null);
        } else {
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
        .then(() => {
          setContent(newContent);
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

  const onChanged = (d) => {
    setDirty(d);
  };

  const renderChapterEditor = () => {
    if (!chapter) {
      return null;
    }

    return (
      <Editor
        content={content ? content.text : ''}
        label={<ChapterBreadcrumb book={book} chapter={chapter} />}
        message={!busy && content === null && (
        <Alert severity="warning">
          <FormattedMessage id="chapter.messages.addingContent" />
        </Alert>
        )}
        identifier={`${book.id}-${chapter.id}-${library.language}`}
        allowOcr={false}
        onSave={saveContents}
        onDirty={onChanged}
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
