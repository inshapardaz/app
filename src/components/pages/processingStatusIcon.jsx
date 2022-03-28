import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// MUI
import { green, red } from '@mui/material/colors';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import FileCopyIcon from '@mui/icons-material/FileCopy';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export const ProcessingStatus = {
  Pending: 'pending',
  Processing: 'processing',
  Complete: 'complete',
  Error: 'error',
  Skipped: 'skipped',
};

const ProcessingStatusIcon = ({ status }) => {
  if (status === ProcessingStatus.Processing) {
    return (<HourglassEmptyIcon />);
  }
  if (status === ProcessingStatus.Complete) {
    return (<CheckCircleOutlineIcon style={{ color: green[500] }} />);
  }
  if (status === ProcessingStatus.Error) {
    return (<ErrorOutlineIcon style={{ color: red[500] }} />);
  }

  return null;
};

ProcessingStatusIcon.propTypes = {
  status: PropTypes.string.isRequired,
};

const AssignList = ({ pages }) => (
  <List>
    {pages.map((page) => (
      <ListItem
        divider
        key={page.sequenceNumber}
        secondaryAction={(<ProcessingStatusIcon status={page.assignStatus} />)}
      >
        <ListItemIcon>
          <FileCopyIcon />
        </ListItemIcon>
        <ListItemText
          primary={page.sequenceNumber}
          secondary={(page.writerAccountId && <FormattedMessage id="page.assignedTo.label" values={{ name: page.writerAccountName }} />)}
        />
      </ListItem>
    ))}
  </List>
);

AssignList.defaultProps = {
  pages: [],
};
AssignList.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.shape({
    sequenceNumber: PropTypes.number,
    assignStatus: PropTypes.string,
    accountId: PropTypes.number,
    accountName: PropTypes.string,
  })),
};
export default AssignList;
