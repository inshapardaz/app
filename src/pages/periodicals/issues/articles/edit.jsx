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
import ArticleBreadcrumb from '@/components/articles/articleBreadcrumb';
import ArticleStatusButton from '@/components/articles/articleStatusButton';
import ArticleAssignButton from '@/components/articles/articleAssignButton';

const ArticleContentEditor = () => {
  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();
  const {
    periodicalId, volumeNumber, issueNumber, sequenceNumber,
  } = useParams();
  const [periodical, setPeriodical] = useState(null);
  const [issue, setIssue] = useState(null);
  const [article, setArticle] = useState(null);
  const [content, setContent] = useState('');
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState(false);
  const library = useSelector((state) => state.libraryReducer.library);

  const loadChapterContent = () => {
    setBusy(true);
    libraryService.getArticleContents(library.id, periodicalId, volumeNumber, issueNumber, sequenceNumber, library.language)
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

  const loadArticle = () => {
    libraryService.getArticle(library.id, periodicalId, volumeNumber, issueNumber, sequenceNumber)
      .then((res) => setArticle(res))
      .then(() => loadChapterContent())
      .catch((e) => {
        console.error(e);
        setBusy(false);
        setError(true);
      })
      .finally(() => setBusy(false));
  };

  const loadIssue = () => {
    libraryService.getIssue(library.id, periodicalId, volumeNumber, issueNumber)
      .then((res) => setIssue(res))
      .then(() => loadArticle())
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
    libraryService.getPeriodicalById(library.id, periodicalId)
      .then((res) => setPeriodical(res))
      .then(() => loadIssue())
      .catch((e) => {
        console.error(e);
        setError(true);
      })
      .finally(() => setBusy(false));
  };

  useEffect(() => {
    if (library && periodicalId && volumeNumber && issueNumber && sequenceNumber) {
      loadData();
    }
  }, [periodicalId, volumeNumber, issueNumber, sequenceNumber, library]);

  const saveContents = (newContent) => {
    setBusy(true);
    if (content == null) {
      //  Adding new content
      return libraryService.addArticleContents(article.links.add_content,
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
    return libraryService.updateArticleContents(content.links.update,
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

  const hasPreviousLink = () => article && article.links && article.links.previous;
  const hasNextLink = () => article && article.links && article.links.next;

  const renderEndToolBar = () => (
    <ButtonGroup>
      <ArticleStatusButton article={article} onUpdating={() => setBusy(true)} onUpdated={() => setBusy(false)} />
      <ArticleAssignButton article={article} button onAssigning={() => setBusy(true)} onAssigned={() => setBusy(false)} />
      <Tooltip title={<FormattedMessage id="page.edit.previous" />}>
        <Button
          disabled={!hasPreviousLink()}
          component={Link}
          to={article ? `/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/articles/${article.sequenceNumber - 1}/edit` : ''}
        >
          { localeService.isRtl() ? <ChevronRightIcon /> : <ChevronLeftIcon /> }
        </Button>
      </Tooltip>
      <Tooltip title={<FormattedMessage id="page.edit.previous" />}>
        <Button
          disabled={!hasNextLink()}
          component={Link}
          to={article ? `/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/articles/${article.sequenceNumber + 1}/edit` : ''}
        >
          { localeService.isRtl() ? <ChevronLeftIcon /> : <ChevronRightIcon /> }
        </Button>
      </Tooltip>
    </ButtonGroup>
  );

  const renderChapterEditor = () => {
    if (!issue) {
      return null;
    }

    return (
      <Editor
        content={content ? content.text : null}
        label={<ArticleBreadcrumb periodical={periodical} issue={issue} selectedArticle={article} button />}
        message={!busy && content === null && (
        <Alert severity="warning">
          <FormattedMessage id="chapter.messages.addingContent" />
        </Alert>
        )}
        endToolbar={renderEndToolBar()}
        identifier={`${periodical.id}-${volumeNumber}-${issueNumber}-${sequenceNumber}-${library.language}`}
        onSave={saveContents}
        onDirty={onChanged}
        direction={getDirection()}
      />
    );
  };
  return (
    <div data-ft="edit-book-page">
      <Helmet title={article ? article.title : ''} />
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

export default ArticleContentEditor;
