import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useConfirm } from 'material-ui-confirm';
import { useSnackbar } from 'notistack';

// MUI
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

// Local Imports
import { libraryService } from '@/services/';
import ButtonWithTooltip from '@/components/buttonWithTooltip';

const DeleteButton = ({
  pages, onUpdated, onDeleting,
}) => {
  const confirm = useConfirm();
  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();

  const onDeleteMultipleClicked = useCallback(() => {
    confirm({
      title: intl.formatMessage({ id: 'action.delete' }),
      description: intl.formatMessage({ id: 'page.action.confirmDeleteMultiple' }, { count: pages.length }),
      confirmationText: intl.formatMessage({ id: 'action.yes' }),
      cancellationText: intl.formatMessage({ id: 'action.no' }),
      confirmationButtonProps: { variant: 'contained', color: 'secondary' },
      cancellationButtonProps: { color: 'secondary' },
    })
      .then(() => {
        const promises = [];
        onDeleting(true);
        pages.map((page) => {
          if (page && page.links && page.links.delete) {
            return promises.push(libraryService.delete(page.links.delete));
          }
          return Promise.resolve();
        });

        Promise.all(promises)
          .then(() => enqueueSnackbar(intl.formatMessage({ id: 'page.messages.deleted' }), { variant: 'success' }))
          .then(() => onDeleting(false))
          .then(() => onUpdated())
          .catch(() => enqueueSnackbar(intl.formatMessage({ id: 'page.messages.error.delete' }), { variant: 'error' }));
      }).catch(() => { });
  }, [pages]);

  return (
    <ButtonWithTooltip
      variant="outlined"
      tooltip={<FormattedMessage id="action.delete" />}
      disabled={pages.length < 1}
      onClick={onDeleteMultipleClicked}
    >
      <DeleteOutlineIcon />
    </ButtonWithTooltip>
  );
};

DeleteButton.defaultProps = {
  pages: null,
  onUpdated: () => {},
  onDeleting: () => {},
};

DeleteButton.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.shape({
    sequenceNumber: PropTypes.number,
    links: PropTypes.shape({
      delete: PropTypes.string,
    }),
  })),
  onUpdated: PropTypes.func,
  onDeleting: PropTypes.func,
};

export default DeleteButton;
