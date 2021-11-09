import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

// MUI
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FileCopyIcon from '@mui/icons-material/FileCopy';

const PagesLink = ({ book, onClick }) => {
  if (book && book.links && book.links.update) {
    return (
      <Tooltip title={<FormattedMessage id="pages.label" />}>
        <IconButton component={Link} to={`/books/${book.id}/pages`} onClick={onClick}>
          <FileCopyIcon />
        </IconButton>
      </Tooltip>
    );
  }
  return null;
};

PagesLink.defaultProps = {
  onClick: () => {},
};

PagesLink.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.number,
    links: PropTypes.shape({
      update: PropTypes.string,
    }),
  }).isRequired,
  onClick: PropTypes.func,
};

export default PagesLink;
