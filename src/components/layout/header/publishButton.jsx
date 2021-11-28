import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

// MUI
import CreateIcon from '@mui/icons-material/Create';
import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

const PublishingButton = ({ onClick, onKeyDown, mobile = false }) => {
  const library = useSelector((state) => state.libraryReducer.library);

  if (library && library.links.create_book) {
    if (mobile) {
      return (
        <ListItem button key="publishing" component={Link} to="/books?page=1&status=beingTyped" data-ft="publishing-link" onClick={onClick} onKeyDown={onKeyDown}>
          <ListItemIcon>
            <CreateIcon />
          </ListItemIcon>
          <ListItemText primary={<FormattedMessage id="header.publishing" />} />
        </ListItem>
      );
    }
    return (
      <Button
        aria-label="publishing"
        component={Link}
        color="inherit"
        variant="outlined"
        to="/books?page=1&status=beingTyped"
        startIcon={<CreateIcon />}
      >
        <FormattedMessage id="header.publishing" />
      </Button>
    );
  }

  return null;
};

PublishingButton.defaultProps = {
  mobile: false,
  onClick: () => { },
  onKeyDown: () => { },
};

PublishingButton.propTypes = {
  mobile: PropTypes.bool,
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
};

export default PublishingButton;
