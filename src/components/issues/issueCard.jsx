import React from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

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
import IssueDeleteButton from '@/components/issues/issueDeleteButton';
import helpers from '@/helpers';

const IssueCard = ({ issue, onUpdated }) => {
  const history = useHistory();

  const renderEditLink = () => {
    if (issue && issue.links && issue.links.update) {
      return (
        <Tooltip title={<FormattedMessage id="action.edit" />}>
          <IconButton component={Link} to={`/periodicals/${issue.periodicalId}/issues/${issue.issueNumber}/edit`}>
            <EditOutlinedIcon />
          </IconButton>
        </Tooltip>
      );
    }
    return null;
  };

  const onOpen = () => history.push(`/periodicals/${issue.periodicalId}/issues/${issue.issueNumber}/articles`);

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
          alt={issue.issueNumber}
          width="282"
          height="350"
          image={(issue.links ? issue.links.image : null) || helpers.defaultPeriodicalImage}
          title={issue.issueNumber}
          onError={helpers.setDefaultPeriodicalImage}
          onClick={() => onOpen()}
        />
      </CardActionArea>
      <CardContent>
        <Grid container justifyContent="stretch">
          <Grid item>
            <Tooltip title={issue.issueNumber} aria-label={issue.issueNumber}>
              <Typography gutterBottom variant="h5" component={Link} noWrap to={`/periodicals/${issue.periodicalId}/issues/${issue.issueNumber}/articles`} sx={{ width: '100%' }}>
                { moment(issue.issueDate).format('MMMM YYYY') }
              </Typography>
            </Tooltip>
            <Typography variant="body2" color="textSecondary" component="p">
              {issue.issueNumber && issue.issueNumber > 0 && <FormattedMessage id="issue.label.issueNumber" values={{ issueNumber: issue.issueNumber }} /> }
              {issue.volumeNumber && issue.volumeNumber > 0 && <span style={{ padding: '0 10px' }}>•</span>}
              {issue.volumeNumber && issue.volumeNumber > 0 && <FormattedMessage id="issue.label.volumeNumber" values={{ volumeNumber: issue.volumeNumber }} />}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions sx={{ flex: '1', alignItems: 'flex-end' }}>
        {renderEditLink()}
        <IssueDeleteButton issue={issue} onDeleted={onUpdated} />
      </CardActions>
    </Card>
  );
};

IssueCard.defaultProps = {
  onUpdated: () => {},
};
IssueCard.propTypes = {
  issue: PropTypes.shape({
    id: PropTypes.number,
    issueNumber: PropTypes.number,
    volumeNumber: PropTypes.number,
    articleCount: PropTypes.number,
    periodicalId: PropTypes.number,
    issueDate: PropTypes.string,
    links: PropTypes.shape({
      image: PropTypes.string,
      update: PropTypes.string,
      delete: PropTypes.string,
    }),
  }).isRequired,
  onUpdated: PropTypes.func,
};

export default IssueCard;
