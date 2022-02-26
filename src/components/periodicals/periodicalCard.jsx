import React from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

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
import PeriodicalDeleteButton from '@/components/periodicals/periodicalDeleteButton';
import helpers from '@/helpers';

const PeriodicalCard = ({ periodical, onUpdated }) => {
  const history = useHistory();

  const renderEditLink = () => {
    if (periodical && periodical.links && periodical.links.update) {
      return (
        <Tooltip title={<FormattedMessage id="action.edit" />}>
          <IconButton component={Link} to={`/periodicals/${periodical.id}/edit`}>
            <EditOutlinedIcon />
          </IconButton>
        </Tooltip>
      );
    }
    return null;
  };

  const onOpen = () => history.push(`/periodicals/${periodical.id}`);

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
          alt={periodical.title}
          width="282"
          height="350"
          image={(periodical.links ? periodical.links.image : null) || helpers.defaultPeriodicalImage}
          title={periodical.title}
          onError={helpers.setDefaultPeriodicalImage}
          onClick={() => onOpen()}
        />
      </CardActionArea>
      <CardContent>
        <Grid container justifyContent="stretch">
          <Grid item>
            <Tooltip title={periodical.title} aria-label={periodical.title}>
              <Typography gutterBottom variant="h5" component={Link} noWrap to={`/periodicals/${periodical.id}`} sx={{ width: '100%' }}>
                {periodical.title}
              </Typography>
            </Tooltip>
            <Typography variant="body2" color="textSecondary" component="p">
              {helpers.truncateWithEllipses(periodical.description, 45)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions sx={{ flex: '1', alignItems: 'flex-end' }}>
        {renderEditLink()}
        <PeriodicalDeleteButton periodical={periodical} onDeleted={onUpdated} />
      </CardActions>
    </Card>
  );
};

PeriodicalCard.defaultProps = {
  onUpdated: () => {},
};
PeriodicalCard.propTypes = {
  periodical: PropTypes.shape({
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
  onUpdated: PropTypes.func,
};

export default PeriodicalCard;
