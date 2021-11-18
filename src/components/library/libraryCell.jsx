import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

// MUI
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

// Local Imports
import actions from '@/actions';
import { localeService } from '@/services';

const LibraryCell = ({ library }) => {
  const dispatch = useDispatch();
  const languages = localeService.getLanguages();

  const onSelect = () => {
    dispatch(actions.setSelectedLibrary(library));
  };

  const language = languages.find((l) => l.locale === library.language).name;

  return (
    <Card data-ft="libraries-cell">
      <CardActionArea onClick={onSelect}>
        <CardContent>
          <Typography variant="h5" component="div" data-ft="library-name">{library.name}</Typography>
          <Typography variant="body2" color="text.secondary" data-ft="library-language">
            { language }
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

LibraryCell.propTypes = {
  library: PropTypes.shape({
    name: PropTypes.string,
    language: PropTypes.string,
  }).isRequired,
};

export default LibraryCell;
