import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

// MUI
import List from '@mui/material/List';

// Local import
import { libraryService } from '@/services/';
import ArticleEditor from '@/components/articles/articleEditor';
import ArticleListItem from '@/components/articles/articleListItem';
import Busy from '@/components/busy';
import Error from '@/components/error';
import Empty from '@/components/empty';
// -------------------------------------------------------

const ArticleList = ({ issue }) => {
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState(false);
  const [editing, setEditing] = useState(false);
  const [articles, setArticles] = useState(null);

  const loadData = () => {
    setBusy(true);
    setError(false);

    return libraryService.getIssueArticles(issue.links.articles)
      .then((res) => setArticles(res))
      .catch(() => setError(true))
      .finally(() => setBusy(false));
  };

  useEffect(() => {
    if (issue) {
      loadData();
    }
  }, [issue]);

  const onDragDrop = (result) => {
    const fromIndex = result.source.index;
    const toIndex = result.destination.index;
    if (fromIndex !== toIndex) {
      const element = articles.data[fromIndex];
      articles.data.splice(fromIndex, 1);
      articles.data.splice(toIndex, 0, element);

      articles.data = articles.data.map((item, index) => {
        item.sequenceNumber = index;
        return item;
      });

      setBusy(true);
      return libraryService.setArticleSequence(articles)
        .then(() => loadData())
        .finally(() => setBusy(false));
    }
  };

  const renderArticles = () => (
    <DragDropContext onDragEnd={onDragDrop}>
      <Droppable droppableId={`Droppable_${issue.issueNumber}`}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <List component="nav" aria-label="main categories">
              <Empty
                items={articles ? articles.data : []}
                message={<FormattedMessage id="chapters.messages.empty" />}
              >
                { articles.data.map((a) => (
                  <ArticleListItem
                    key={a.sequenceNumber}
                    issue={issue}
                    article={a}
                    onUpdated={loadData}
                    canEdit={!editing}
                    onStartEditing={() => setEditing(true)}
                    onEndEditing={() => setEditing(false)}
                  />
                ))}
              </Empty>
              {provided.placeholder}
            </List>
          </div>
        )}
      </Droppable>
      {articles.links.create && (
      <ArticleEditor
        createLink={articles.links.create}
        onUpdated={loadData}
        newIssueIndex={articles.data.length + 1}
      />
      )}
    </DragDropContext>
  );

  return (
    <>
      <Error
        error={error}
        message={<FormattedMessage id="book.messages.error.loading" />}
        actionText={<FormattedMessage id="action.retry" />}
        onAction={loadData}
      >
        <Busy busy={busy} />
        {articles && renderArticles() }
      </Error>
    </>
  );
};

ArticleList.defaultProps = {
  issue: null,
};
ArticleList.propTypes = {
  issue: PropTypes.shape({
    issueNumber: PropTypes.number,
    links: PropTypes.shape({
      articles: PropTypes.string,
    }),
  }),
};

export default ArticleList;
