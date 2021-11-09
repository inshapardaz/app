import React from 'react';
import PropTypes from 'prop-types';

import { useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

// MUI
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import EditIcon from '@mui/icons-material/Edit';

// Local import
import AuthorDeleteButton from '@/components/authors/deleteAuthorButton';
import helpers from '@/helpers';

const AuthorListItem = ({ author, onDeleted }) => {
  const history = useHistory();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  const authorClicked = () => history.push(`/authors/${author.id}`);

  return (
    <ListItem
      key={author.id}
      button
      divider
      secondaryAction={(
        <>
          <Tooltip title={<FormattedMessage id="action.edit" />}>
            <IconButton onClick={() => history.push(`/authors/${author.id}/edit`)}><EditIcon /></IconButton>
          </Tooltip>
          <AuthorDeleteButton author={author} onDeleted={onDeleted} />
        </>
)}
    >
      {matches && (
      <ListItemIcon onClick={authorClicked} sx={{ mr: theme.spacing(1) }}>
        <Avatar
          src={(author.links ? author.links.image : null) || helpers.defaultAuthorImage}
          imgProps={{ onError: helpers.setDefaultAuthorImage }}
          sx={{ width: 98, height: 98 }}
        />
      </ListItemIcon>
      )}
      <ListItemText
        onClick={authorClicked}
        primary={author.name}
        secondary={(
          <>
            <FormattedMessage id="authors.item.book.count" values={{ count: author.bookCount }} />
            {matches && (
            <Typography sx={{ pt: theme.spacing(1), mr: theme.spacing(8), display: 'block' }} variant="body2" color="textSecondary" component="span">
              {helpers.truncateWithEllipses(author.description, 200)}
            </Typography>
            )}
          </>
)}
      />
    </ListItem>
  );
};

AuthorListItem.propTypes = {
  author: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    bookCount: PropTypes.number,
    links: PropTypes.shape({
      image: PropTypes.string,
      update: PropTypes.string,
    }),
  }).isRequired,

  onDeleted: PropTypes.func.isRequired,
};

export default AuthorListItem;
