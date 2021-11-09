import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// MUI
import ImageList from '@mui/material/ImageList';

// Local Imports
import Empty from '@/components/empty';
import PageImageItem from '@/components/pages/pageImageItem';

const PageGrid = ({
  pages, onCheckChanged, onUpdated, selectedPages,
}) => {
  if (!pages) return null;
  return (

    <Empty items={pages.data} message={<FormattedMessage id="pages.messages.empty" />}>
      <ImageList rowHeight={400} cols={4} sx={{ py: '10px', overflow: 'hidden' }}>
        {pages.data.map((page) => (
          <PageImageItem
            key={page.sequenceNumber}
            page={page}
            onUpdated={onUpdated}
            onCheckChanged={onCheckChanged}
            checked={selectedPages.indexOf(page.sequenceNumber) >= 0}
          />
        ))}
      </ImageList>
    </Empty>
  );
};

PageGrid.defaultProps = {
  pages: null,
  selectedPages: [],
  onUpdated: () => {},
  onCheckChanged: () => {},
};
PageGrid.propTypes = {
  pages: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({
      sequenceNumber: PropTypes.number,
    })),
  }),
  selectedPages: PropTypes.arrayOf(PropTypes.number),
  onUpdated: PropTypes.func,
  onCheckChanged: PropTypes.func,
};

export default PageGrid;
