import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// MUI
import { useTheme } from '@mui/material/styles';
import ImageList from '@mui/material/ImageList';
import useMediaQuery from '@mui/material/useMediaQuery';

// Local Imports
import Empty from '@/components/empty';
import PageImageItem from '@/components/pages/pageImageItem';

const PageGrid = ({
  pages, onCheckChanged, onUpdated, selectedPages,
}) => {
  const theme = useTheme();
  const matchDownLg = useMediaQuery(theme.breakpoints.down('lg'));
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  if (!pages) return null;

  let columns = 4;
  if (matchDownSM) {
    columns = 1;
  } else if (matchDownMd) {
    columns = 2;
  } else if (matchDownLg) {
    columns = 3;
  } else {
    columns = 4;
  }

  return (

    <Empty items={pages.data} message={<FormattedMessage id="pages.messages.empty" />}>
      <ImageList rowHeight={400} cols={columns} sx={{ py: '10px', overflow: 'hidden' }}>
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
