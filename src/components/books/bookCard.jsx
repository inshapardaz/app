import React from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';

// MUI
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

// Local imports
import FavoriteButton from '@/components/books/favoriteButton';
import BookProgress from '@/components/books/bookProgress';
import BookSeriesLabel from '@/components/books/bookSeriesLabel';
import BookCategoriesLabel from '@/components/books/bookCategoriesLabel';
import DeleteBookButton from '@/components/books/deleteBookButton';
import AuthorsGroup from '@/components/authors/authorsGroup';
import helpers from '@/helpers';

const BookCard = ({ book, onUpdated, showProgress = false }) => {
  const intl = useIntl();
  const history = useHistory();

  const renderEditLink = () => {
    if (book && book.links && book.links.update) {
      return (
        <Tooltip title={<FormattedMessage id="action.edit" />}>
          <IconButton component={Link} to={`/books/${book.id}/edit`}>
            <EditOutlinedIcon />
          </IconButton>
        </Tooltip>
      );
    }
    return null;
  };

  const renderBookStatus = () => {
    if (book.status === 'Published') return null;

    const statuses = [{
      key: 'AvailableForTyping',
      name: intl.formatMessage({ id: 'book.status.AvailableForTyping' }),
    }, {
      key: 'BeingTyped',
      name: intl.formatMessage({ id: 'book.status.BeingTyped' }),
    }, {
      key: 'ReadyForProofRead',
      name: intl.formatMessage({ id: 'book.status.ReadyForProofRead' }),
    }, {
      key: 'ProofRead',
      name: intl.formatMessage({ id: 'book.status.ProofRead' }),
    }];

    return (
      <CardActions>
        <Typography variant="body2" color="textSecondary" component="span">
          {statuses.find((x) => x.key === book.status).name}
        </Typography>
      </CardActions>
    );
  };

  const onOpen = () => history.push(`/books/${book.id}`);

  return (
    <Card sx={{
      maxWidth: '345px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          alt={book.title}
          width="282"
          height="400"
          image={(book.links ? book.links.image : null) || helpers.defaultBookImage}
          title={book.title}
          onError={helpers.setDefaultBookImage}
          onClick={() => onOpen()}
        />
      </CardActionArea>
      <CardContent>
        <Grid container justifyContent="stretch">
          <Grid item container justifyContent="space-between">
            <AuthorsGroup authors={book.authors} showText={false} />
            <Grid item sm={4}>
              <BookCategoriesLabel book={book} alignPills="right" />
            </Grid>
          </Grid>
          <Grid item>
            <Tooltip title={book.title} aria-label={book.title}>
              <Typography gutterBottom variant="h5" component={Link} noWrap to={`/books/${book.id}`} sx={{ width: '100%' }}>
                {book.title}
              </Typography>
            </Tooltip>
            <BookSeriesLabel book={book} />
            <Typography variant="body2" color="textSecondary" component="p">
              {helpers.truncateWithEllipses(book.description, 45)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      {renderBookStatus()}
      { showProgress && <CardActions><BookProgress book={book} /></CardActions>}
      <CardActions sx={{ flex: '1', alignItems: 'flex-end' }}>
        {renderEditLink()}
        <DeleteBookButton book={book} onDeleted={onUpdated} />
        <FavoriteButton book={book} onUpdated={onUpdated} />
      </CardActions>
    </Card>
  );
};

BookCard.defaultProps = {
  showProgress: false,
  onUpdated: () => {},
};
BookCard.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    authors: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })),
    status: PropTypes.string,
    links: PropTypes.shape({
      image: PropTypes.string,
      update: PropTypes.string,
      delete: PropTypes.string,
    }),
  }).isRequired,
  showProgress: PropTypes.bool,
  onUpdated: PropTypes.func,
};

export default BookCard;
