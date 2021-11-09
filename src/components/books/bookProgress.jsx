import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

// MUI
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

const BookProgress = ({ book }) => {
  const intl = useIntl();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const popOver = () => {
    if (book.pageStatus) {
      return (
        <Box p={2} sx={{ minWidth: 200 }}>
          { book.pageStatus.map((s) => (
            <div key={s.status}>
              <Typography variant="caption" display="block" gutterBottom><FormattedMessage id={`status.${s.status}`} /></Typography>
              <LinearProgress
                value={s.percentage}
                variant="determinate"
                sx={{
                  marginTop: '2px',
                  marginBottom: '2px',
                }}
                color={s.status === 'Completed' ? 'primary' : 'secondary'}
              />
            </div>
          ))}
        </Box>
      );
    }

    return (<Box p={2} sx={{ minWidth: 200 }}><Typography component="span"><FormattedMessage id="pages.progress.none" /></Typography></Box>);
  };

  const renderTotalProgress = () => {
    if (book.pageCount > 0) {
      const completed = intl.formatNumber(book.progress, { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 0 });
      const count = book.pageCount;
      return (
        <>
          <FormattedMessage id="pages.progress" values={{ completed, count }} />
          <LinearProgress value={book.progress * 100} variant="determinate" />
        </>
      );
    }

    return (<FormattedMessage id="pages.progress.none" />);
  };

  const open = Boolean(anchorEl);

  if (book.status === 'Published') return null;

  return (
    <>
      <Typography
        variant="body2"
        color="textSecondary"
        component="span"
        onClick={handleClick}
        sx={{
          cursor: 'pointer',
        }}
      >
        {renderTotalProgress()}
      </Typography>
      <Popover
        id={book.id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {popOver()}
      </Popover>
    </>
  );
};

BookProgress.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.number,
    status: PropTypes.string,
    progress: PropTypes.number,
    pageCount: PropTypes.number,
    pageStatus: PropTypes.arrayOf(PropTypes.shape({

    })),
  }).isRequired,
};
export default BookProgress;
