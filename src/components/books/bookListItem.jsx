import React from 'react';
import PropTypes from 'prop-types';

import { useHistory, Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

// MUI
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Avatar from '@mui/material/Avatar';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// Local import
import BookDeleteButton from '@/components/books/deleteBookButton';
import AuthorsGroup from '@/components/authors/authorsGroup';
import FavoriteButton from '@/components/books/favoriteButton';
import BookSeriesLabel from '@/components/books/bookSeriesLabel';
import BookCategoriesLabel from '@/components/books/bookCategoriesLabel';
import helpers from '@/helpers';

// ----------------------------------------------------------

const BookMenu = ({ book, onUpdated }) => {
  const history = useHistory();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!matches) {
    return (
      <>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls="long-menu"
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <Tooltip title={<FormattedMessage id="action.edit" />}>
            <IconButton onClick={() => history.push(`/books/${book.id}/edit`)}><EditIcon /></IconButton>
          </Tooltip>
          <BookDeleteButton book={book} onDeleted={onUpdated} onClick={handleClose} />
          <FavoriteButton book={book} onUpdated={onUpdated} />
        </Menu>
      </>
    );
  }

  return (
    <>
      <Tooltip title={<FormattedMessage id="action.edit" />}>
        <IconButton onClick={() => history.push(`/books/${book.id}/edit`)}><EditIcon /></IconButton>
      </Tooltip>
      <BookDeleteButton book={book} onDeleted={onUpdated} />
      <FavoriteButton book={book} onUpdated={onUpdated} />
    </>
  );
};

BookMenu.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,

  onUpdated: PropTypes.func.isRequired,
};

// --------------------------------------------------------

const BookListItem = ({ book, onUpdated }) => {
  const history = useHistory();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <ListItem
      key={book.id}
      disableRipple
      button
      divider
      sx={{ cursor: 'default' }}
    >
      {matches && (
      <ListItemIcon onClick={() => history.push(`/books/${book.id}`)} sx={{ mr: theme.spacing(1) }}>
        <Avatar
          variant="square"
          src={(book.links ? book.links.image : null) || helpers.defaultAuthorImage}
          imgProps={{ onError: helpers.setDefaultAuthorImage }}
          sx={{ cursor: 'pointer', width: 100, height: 150 }}
        />
      </ListItemIcon>
      )}
      <ListItemText
        sx={{ width: '100%' }}
        primary={(
          <Grid container justifyContent="space-between" sx={{ backgroundColor: 'grey' }}>
            <Grid item sm={6}>
              <Link to={`/books/${book.id}`}>{book.title}</Link>
            </Grid>
            <Grid item>
              <AuthorsGroup authors={book.authors} showText={matches} />
            </Grid>
          </Grid>
)}
        secondaryTypographyProps={{ component: 'div' }}
        secondary={(
          <>
            {matches && (
            <Typography
              sx={{
                pt: theme.spacing(1), mr: theme.spacing(1), mb: theme.spacing(2), display: 'block',
              }}
              variant="body2"
              color="textSecondary"
              component="span"
            >
              {helpers.truncateWithEllipses(book.description, 500)}
            </Typography>
            )}
            <BookSeriesLabel book={book} />
            <BookCategoriesLabel book={book} alignPills="left" />
          </>
)}
      />
      <ListItemText />
      <ListItemSecondaryAction sx={{ top: 'auto', bottom: 0 }}>
        <BookMenu book={book} onUpdated={onUpdated} />
      </ListItemSecondaryAction>
    </ListItem>
  );
};

BookListItem.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    bookCount: PropTypes.number,
    authors: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })),
    categories: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })),
    links: PropTypes.shape({
      image: PropTypes.string,
      update: PropTypes.string,
    }),
  }).isRequired,

  onUpdated: PropTypes.func.isRequired,
};

export default BookListItem;
