import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useConfirm } from 'material-ui-confirm';
import { useSnackbar } from 'notistack';

// MUI
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/DeleteOutline';

// Local Imports
import { libraryService } from '@/services';

const IssueDeleteButton = ({ issue, onDeleted, button = false }) => {
  const intl = useIntl();
  const confirm = useConfirm();
  const { enqueueSnackbar } = useSnackbar();

  const onDelete = () => {
    confirm({
      title: intl.formatMessage({ id: 'action.delete' }),
      description: intl.formatMessage({ id: 'issues.action.confirmDelete' }, { title: issue.issueNumber }),
      confirmationText: intl.formatMessage({ id: 'action.yes' }),
      cancellationText: intl.formatMessage({ id: 'action.no' }),
      confirmationButtonProps: { variant: 'contained', color: 'secondary' },
      cancellationButtonProps: { color: 'secondary' },
    })
      .then(() => libraryService.deletePeriodical(issue)
        .then(() => enqueueSnackbar(intl.formatMessage({ id: 'issues.messages.deleted' }), { variant: 'success' }))
        .then(() => onDeleted && onDeleted(true))
        .catch(() => enqueueSnackbar(intl.formatMessage({ id: 'issues.messages.error.delete' }), { variant: 'error' })))
      .catch(() => {});
  };

  if (issue && issue.links && issue.links.delete) {
    if (button) {
      return (
        <Button onClick={onDelete} startIcon={<DeleteIcon />} color="error">
          <FormattedMessage id="action.delete" />
        </Button>
      );
    }
    return (
      <Tooltip title={<FormattedMessage id="action.delete" />}>
        <IconButton onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    );
  }

  return null;
};

IssueDeleteButton.defaultProps = {
  onDeleted: () => {},
  button: false,
};

IssueDeleteButton.propTypes = {
  issue: PropTypes.shape({
    id: PropTypes.number,
    issueNumber: PropTypes.number,
    volumeNumber: PropTypes.number,
    articleCount: PropTypes.number,
    periodicalId: PropTypes.number,
    issueDate: PropTypes.string,
    links: PropTypes.shape({
      delete: PropTypes.string,
    }),
  }).isRequired,
  button: PropTypes.bool,
  onDeleted: PropTypes.func,
};

export default IssueDeleteButton;
