import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// MUI
import List from '@mui/material/List';

// Local Imports
import Empty from '@/components/empty';
import PageListItem from '@/components/pages/pageListItem';

const PageList = ({
  pages, onCheckChanged, onUpdated, selectedPages,
}) => {
  if (!pages) return null;

  return (

    <Empty items={pages.data} message={<FormattedMessage id="pages.messages.empty" />}>
      <List component="nav" aria-label="authors" sx={{ mx: (theme) => theme.spacing(2) }}>
        {pages.data.map((p) => (
          <PageListItem
            key={p.sequenceNumber}
            page={p}
            checked={selectedPages.indexOf(p.sequenceNumber) >= 0}
            onUpdated={onUpdated}
            onCheckChanged={onCheckChanged}
          />
        ))}
      </List>
    </Empty>
  );
};

PageList.defaultProps = {
  pages: null,
  selectedPages: [],
  onUpdated: () => {},
  onCheckChanged: () => {},
};
PageList.propTypes = {
  pages: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({
      sequenceNumber: PropTypes.number,
    })),
  }),
  selectedPages: PropTypes.arrayOf(PropTypes.number),
  onUpdated: PropTypes.func,
  onCheckChanged: PropTypes.func,
};

export default PageList;
