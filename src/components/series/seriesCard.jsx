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
import DeleteSeriesButton from '@/components/series/deleteSeriesButton';
import helpers from '@/helpers';

const SeriesCard = ({ series, onDeleted }) => {
  const history = useHistory();

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea component={Link} to={`/series/${series.id}`}>
        <CardMedia
          component="img"
          alt={series.name}
          height="240"
          image={(series.links ? series.links.image : null) || helpers.defaultSeriesImage}
          onError={helpers.setDefaultSeriesImage}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2" noWrap>
            {series.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            <FormattedMessage id="series.item.book.count" values={{ count: series.bookCount }} />
          </Typography>
          <Tooltip title={series.description || ''}>
            { series.description ? (
              <Typography variant="body2" color="textSecondary" component="span">
                {helpers.truncateWithEllipses(series.description, 30)}
              </Typography>
            ) : (<span style={{ opacity: 0 }}>No description</span>)}
          </Tooltip>
        </CardContent>
      </CardActionArea>
      <CardActions>
        {series && series.links && series.links.update && (
        <Tooltip title={<FormattedMessage id="action.edit" />}>
          <IconButton onClick={() => history.push(`/series/${series.id}/edit`)}><EditIcon /></IconButton>
        </Tooltip>
        )}
        <DeleteSeriesButton series={series} onDeleted={onDeleted} />
        <IconButton component={Link} to={`/books?series=${series.id}`}>
          <MenuBookIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

SeriesCard.propTypes = {
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

export default SeriesCard;
