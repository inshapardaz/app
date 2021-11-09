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

const SeriesCategoryButton = ({ series, onDeleted }) => {
  const intl = useIntl();
  const confirm = useConfirm();
  const { enqueueSnackbar } = useSnackbar();

  const onDelete = useCallback(() => {
    confirm({
      title: intl.formatMessage({ id: 'action.delete' }),
      description: intl.formatMessage({ id: 'categories.action.confirmDelete' }, { name: series.name }),
      confirmationText: intl.formatMessage({ id: 'action.yes' }),
      cancellationText: intl.formatMessage({ id: 'action.no' }),
      confirmationButtonProps: { variant: 'contained', color: 'secondary' },
      cancellationButtonProps: { color: 'secondary' },
    })
      .then(() => libraryService.deleteSeries(series)
        .then(() => enqueueSnackbar(intl.formatMessage({ id: 'series.messages.deleted' }), { variant: 'success' }))
        .then(() => onDeleted && onDeleted(true))
        .catch(() => enqueueSnackbar(intl.formatMessage({ id: 'series.messages.error.delete' }), { variant: 'error' })))
      .catch(() => {});
  }, [series]);

  if (series && series.links && series.links.delete) {
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

SeriesCategoryButton.propTypes = {
  series: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    links: PropTypes.shape({
      delete: PropTypes.string,
    }),
  }).isRequired,

  onDeleted: PropTypes.func.isRequired,
};

export default SeriesCategoryButton;
