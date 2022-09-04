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
import PeriodicalDeleteButton from '@/components/periodicals/periodicalDeleteButton';
import helpers from '@/helpers';
import CategoriesLabel from '@/components/categories/categoriesLabel';

// ----------------------------------------------------------

const PeriodicalMenu = ({ periodical, onUpdated }) => {
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
            <IconButton onClick={() => history.push(`/periodicals/${periodical.id}/edit`)}><EditIcon /></IconButton>
          </Tooltip>
          <PeriodicalDeleteButton periodical={periodical} onDeleted={onUpdated} onClick={handleClose} />
        </Menu>
      </>
    );
  }

  return (
    <>
      <Tooltip title={<FormattedMessage id="action.edit" />}>
        <IconButton onClick={() => history.push(`/periodicals/${periodical.id}/edit`)}><EditIcon /></IconButton>
      </Tooltip>
      <PeriodicalDeleteButton periodical={periodical} onDeleted={onUpdated} />
    </>
  );
};

PeriodicalMenu.propTypes = {
  periodical: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,

  onUpdated: PropTypes.func.isRequired,
};

// --------------------------------------------------------

const PeriodicalListItem = ({ periodical, onUpdated }) => {
  const history = useHistory();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  return (
    <ListItem
      key={periodical.id}
      disableRipple
      button
      divider
      sx={{ cursor: 'default' }}
    >
      {matches && (
      <ListItemIcon onClick={() => history.push(`/periodicals/${periodical.id}/issues`)} sx={{ mr: theme.spacing(1) }}>
        <Avatar
          variant="square"
          src={(periodical.links ? periodical.links.image : null) || helpers.defaultPeriodicalImage}
          imgProps={{ onError: helpers.setDefaultPeriodicalImage }}
          sx={{ cursor: 'pointer', width: 120, height: 150 }}
        />
      </ListItemIcon>
      )}
      <ListItemText
        sx={{ width: '100%' }}
        primary={(
          <Grid container justifyContent="space-between" sx={{ backgroundColor: 'grey' }}>
            <Grid item sm={6}>
              <Link to={`/periodicals/${periodical.id}/issues`}>{periodical.title}</Link>
            </Grid>
          </Grid>
)}
        secondaryTypographyProps={{ component: 'div' }}
        secondary={(
          <>
            <FormattedMessage id="periodical.issue.count" values={{ count: periodical.issueCount }} />
            {matches && (
            <Typography sx={{ pt: theme.spacing(1), mr: theme.spacing(8), display: 'block' }} variant="body2" color="textSecondary" component="span">
              {helpers.truncateWithEllipses(periodical.description, 500)}
            </Typography>
            )}
            <Typography variant="body2" color="textSecondary" component="span">
              <FormattedMessage id={`frequency.${periodical.frequency}`} />
            </Typography>
            <CategoriesLabel categories={periodical.categories} alignPills="left" type="periodicals" />
          </>
)}
      />
      <ListItemText />
      <ListItemSecondaryAction sx={{ top: 'auto', bottom: 0 }}>
        <PeriodicalMenu periodical={periodical} onUpdated={onUpdated} />
      </ListItemSecondaryAction>
    </ListItem>
  );
};

PeriodicalListItem.propTypes = {
  periodical: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    issueCount: PropTypes.number,
    frequency: PropTypes.string,
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

export default PeriodicalListItem;
