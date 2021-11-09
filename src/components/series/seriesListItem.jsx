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
import DeleteSeriesButton from '@/components/series/deleteSeriesButton';
import helpers from '@/helpers';

const SeriesListItem = ({ series, onDeleted }) => {
  const history = useHistory();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const seriesClicked = () => history.push(`/books?series=${series.id}`);

  return (
    <ListItem
      key={series.id}
      button
      divider
      secondaryAction={(
        <>
          <Tooltip title={<FormattedMessage id="action.edit" />}>
            <IconButton onClick={() => history.push(`/series/${series.id}/edit`)}><EditIcon /></IconButton>
          </Tooltip>
          <DeleteSeriesButton series={series} onDeleted={onDeleted} />
        </>
)}
    >
      {matches && (
      <ListItemIcon onClick={seriesClicked}>
        <Avatar
          variant="square"
          src={(series.links ? series.links.image : null) || helpers.defaultSeriesImage}
          imgProps={{ onError: helpers.setDefaultSeriesImage }}
          sx={{ width: 120, height: 120, mr: theme.spacing(2) }}
        />
      </ListItemIcon>
      )}
      <ListItemText
        onClick={seriesClicked}
        primary={series.name}
        secondary={(
          <>
            <FormattedMessage id="series.item.book.count" values={{ count: series.bookCount }} />
            {matches && (
            <Typography sx={{ pt: theme.spacing(1), mr: theme.spacing(8), display: 'block' }} variant="body2" color="textSecondary" component="span">
              {series.description}
            </Typography>
            )}
          </>
)}
      />
    </ListItem>
  );
};

SeriesListItem.propTypes = {
  series: PropTypes.shape({
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

export default SeriesListItem;
