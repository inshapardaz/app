import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// MUI
import Chip from '@mui/material/Chip';
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';

const AuthorChip = ({ author, showText = true }) => {
  if (showText) {
    return (
      <Chip
        key={author.id}
        component={Link}
        sx={{ cursor: 'pointer' }}
        to={`/authors/${author.id}`}
        avatar={(
          <Avatar
            alt={author.name}
            src={author.links.image}
          />
)}
        label={author.name}
        variant="outlined"
      />
    );
  }

  return (
    <Tooltip title={author.name}>
      <Avatar
        component={Link}
        to={`/authors/${author.id}`}
        alt={author.name}
        src={author.links.image}
      >
        {author.name[0]}

      </Avatar>
    </Tooltip>
  );
};

AuthorChip.defaultProps = {
  showText: true,
};

AuthorChip.propTypes = {
  author: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    links: PropTypes.shape({
      image: PropTypes.string,
    }),
  }).isRequired,
  showText: PropTypes.bool,
};

const AuthorsGroup = ({ authors, max = 3, showText = true }) => (
  <AvatarGroup max={max}>
    {authors.map((a) => <AuthorChip key={a.id} author={a} showText={showText} />)}
  </AvatarGroup>
);

AuthorsGroup.defaultProps = {
  authors: [],
  max: 3,
  showText: true,
};

AuthorsGroup.propTypes = {
  authors: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    links: PropTypes.shape({
      image: PropTypes.string,
    }),
  })),
  max: PropTypes.number,
  showText: PropTypes.bool,
};

export default AuthorsGroup;
