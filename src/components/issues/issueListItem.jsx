import React from 'react';
import PropTypes from 'prop-types';

import { useHistory, Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

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
import IssueDeleteButton from '@/components/issues/issueDeleteButton';
import helpers from '@/helpers';

// ----------------------------------------------------------

const IssueMenu = ({ issue, onUpdated }) => {
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
          {issue && issue.links && issue.links.update && (
          <Tooltip title={<FormattedMessage id="action.edit" />}>
            <IconButton onClick={() => history.push(`/periodicals/${issue.periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}/edit`)}><EditIcon /></IconButton>
          </Tooltip>
          )}
          <IssueDeleteButton issue={issue} onDeleted={onUpdated} onClick={handleClose} />
        </Menu>
      </>
    );
  }

  return (
    <>
      {issue && issue.links && issue.links.update && (
      <Tooltip title={<FormattedMessage id="action.edit" />}>
        <IconButton onClick={() => history.push(`/periodicals/${issue.periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}/edit`)}><EditIcon /></IconButton>
      </Tooltip>
      )}
      <IssueDeleteButton issue={issue} onDeleted={onUpdated} />
    </>
  );
};

IssueMenu.propTypes = {
  issue: PropTypes.shape({
    id: PropTypes.number,
    periodicalId: PropTypes.number,
    issueDate: PropTypes.string,
    issueNumber: PropTypes.number,
    volumeNumber: PropTypes.number,
    links: PropTypes.shape({
      image: PropTypes.string,
      update: PropTypes.string,
    }),
  }).isRequired,

  onUpdated: PropTypes.func.isRequired,
};

// --------------------------------------------------------

const IssueListItem = ({ issue, onUpdated }) => {
  const history = useHistory();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <ListItem
      key={issue.id}
      disableRipple
      button
      divider
      sx={{ cursor: 'default' }}
    >
      {matches && (
      <ListItemIcon onClick={() => history.push(`/periodicals/${issue.periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}`)} sx={{ mr: theme.spacing(1) }}>
        <Avatar
          variant="square"
          src={(issue.links ? issue.links.image : null) || helpers.defaultIssueImage}
          imgProps={{ onError: helpers.setDefaultIssueImage }}
          sx={{ cursor: 'pointer', width: 120, height: 150 }}
        />
      </ListItemIcon>
      )}
      <ListItemText
        sx={{ width: '100%' }}
        primary={(
          <Grid container justifyContent="space-between" sx={{ backgroundColor: 'grey' }}>
            <Grid item sm={6}>
              <Link to={`/periodicals/${issue.periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}`}>{ moment(issue.issueDate).format('MMMM YYYY') }</Link>
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
              <Typography variant="body2" color="textSecondary" component="p">
                {issue.issueNumber && issue.issueNumber > 0 && <FormattedMessage id="issue.label.issueNumber" values={{ issueNumber: issue.issueNumber }} /> }
                {issue.volumeNumber && issue.volumeNumber > 0 && <span style={{ padding: '0 10px' }}>•</span>}
                {issue.volumeNumber && issue.volumeNumber > 0 && <FormattedMessage id="issue.label.volumeNumber" values={{ volumeNumber: issue.volumeNumber }} />}
              </Typography>
            </Typography>
            )}
          </>
)}
      />
      <ListItemText />
      <ListItemSecondaryAction sx={{ top: 'auto', bottom: 0 }}>
        <IssueMenu issue={issue} onUpdated={onUpdated} />
      </ListItemSecondaryAction>
    </ListItem>
  );
};

IssueListItem.propTypes = {
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
    }),
  }).isRequired,

  onUpdated: PropTypes.func.isRequired,
};

export default IssueListItem;
