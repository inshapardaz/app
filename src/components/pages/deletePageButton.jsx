import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useConfirm } from 'material-ui-confirm';
import { useSnackbar } from 'notistack';

// MUI
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';

// Local Imports
import { libraryService } from '@/services';

const PageDeleteButton = ({ page, onDeleted, invert }) => {
  const intl = useIntl();
  const confirm = useConfirm();
  const { enqueueSnackbar } = useSnackbar();

  const onDelete = useCallback(() => {
    confirm({
      title: intl.formatMessage({ id: 'action.delete' }),
      description: intl.formatMessage({ id: 'page.action.confirmDelete' }, { sequenceNumber: page.sequenceNumber }),
      confirmationText: intl.formatMessage({ id: 'action.yes' }),
      cancellationText: intl.formatMessage({ id: 'action.no' }),
      confirmationButtonProps: { variant: 'contained', color: 'secondary' },
      cancellationButtonProps: { color: 'secondary' },
    })
      .then(() => libraryService.deletePage(page)
        .then(() => enqueueSnackbar(intl.formatMessage({ id: 'page.messages.deleted' }), { variant: 'success' }))
        .then(() => onDeleted && onDeleted())
        .catch(() => enqueueSnackbar(intl.formatMessage({ id: 'page.messages.error.delete' }), { variant: 'error' })))
      .catch(() => {});
  }, [page]);

  if (page && page.links && page.links.delete) {
    return (
      <Tooltip title={<FormattedMessage id="action.delete" />}>
        <IconButton onClick={onDelete}>
          <DeleteIcon sx={{ color: (theme) => (invert ? theme.palette.background.paper : theme.palette.text.primary) }} />
        </IconButton>
      </Tooltip>
    );
  }

  return null;
};

PageDeleteButton.defaultProps = {
  invert: false,
};

PageDeleteButton.propTypes = {
  page: PropTypes.shape({
    sequenceNumber: PropTypes.number,
    links: PropTypes.shape({
      delete: PropTypes.string,
    }),
  }).isRequired,
  invert: PropTypes.bool,
  onDeleted: PropTypes.func.isRequired,
};

export default PageDeleteButton;
