import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

// MUI
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EditIcon from '@mui/icons-material/Edit';

// Local import
import AuthorDeleteButton from '@/components/authors/deleteAuthorButton';
import helpers from '@/helpers';

const AuthorCard = ({ author, onDeleted }) => {
  const history = useHistory();

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea component={Link} to={`/authors/${author.id}`}>
        <CardMedia
          component="img"
          alt={author.name}
          height="360"
          image={(author.links ? author.links.image : null) || helpers.defaultAuthorImage}
          onError={helpers.setDefaultAuthorImage}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2" noWrap>
            {author.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            <FormattedMessage id="authors.item.book.count" values={{ count: author.bookCount }} />
          </Typography>
          <Tooltip title={author.description || ''}>
            { author.description ? (
              <Typography variant="body2" color="textSecondary" component="span">
                {helpers.truncateWithEllipses(author.description, 30)}
              </Typography>
            ) : (<span style={{ opacity: 0 }}>No description</span>)}
          </Tooltip>
        </CardContent>
      </CardActionArea>
      <CardActions>
        {author && author.links && author.links.update && (
        <Tooltip title={<FormattedMessage id="action.edit" />}>
          <IconButton onClick={() => history.push(`/authors/${author.id}/edit`)}><EditIcon /></IconButton>
        </Tooltip>
        )}
        <AuthorDeleteButton author={author} onDeleted={onDeleted} />
        <IconButton component={Link} to={`/books?author=${author.id}`}>
          <MenuBookIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

AuthorCard.propTypes = {
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

export default AuthorCard;
