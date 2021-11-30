import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Helmet } from 'react-helmet';
import { FormattedMessage, useIntl } from 'react-intl';

// Local Imports
import { libraryService } from '@/services/';
import Busy from '@/components/busy';
import Error from '@/components/error';
import ReaderView from '@/components/reader';

const ChapterViewer = () => {
  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const { bookId, chapterNumber } = useParams();
  const [book, setBook] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState(false);
  const library = useSelector((state) => state.libraryReducer.library);

  const loadChapterContent = () => {
    setBusy(true);
    libraryService.getChapterContents(library.id, bookId, chapterNumber, library.language)
      .then((data) => {
        setContent(data);
      })
      .catch((e) => {
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
      .catch(() => {
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
      .catch(() => {
        setError(true);
      })
      .finally(() => setBusy(false));
  };

  useEffect(() => {
    if (bookId && chapterNumber && library) {
      loadData();
    }
  }, [bookId, chapterNumber, library]);

  return (
    <div data-ft="view-chapter-page">
      <Helmet title={chapter ? chapter.title : ''} />
      <Error
        error={error}
        message={<FormattedMessage id="chapter.messages.error.loading" />}
        actionText={<FormattedMessage id="action.retry" />}
        onAction={loadData}
      >
        <Busy busy={busy} />
        <ReaderView book={book} selectedChapter={chapter} format="markdown" data={content ? content.text : ''} />
      </Error>
    </div>
  );
};

export default ChapterViewer;
