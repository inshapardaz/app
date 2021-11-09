import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSnackbar } from 'notistack';

// MUI
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

// Local Imports
import { libraryService } from '@/services';
import ButtonWithTooltip from '@/components/buttonWithTooltip';

const AssignToMeButton = ({ pages, onAssigned, onAssigning }) => {
  const intl = useIntl();
  const { enqueueSnackbar } = useSnackbar();

  const onAssignToMe = useCallback(() => {
    const promises = [];

    pages.map((page) => {
      if (page !== null && page !== undefined) {
        if (page.links.assign_to_me) {
          return promises.push(libraryService.post(page.links.assign_to_me));
        }
      }

      return Promise.resolve();
    });

    onAssigning(true);
    Promise.all(promises)
      .then(() => enqueueSnackbar(intl.formatMessage({ id: 'pages.messages.assigned' }), { variant: 'success' }))
      .then(() => onAssigning(false))
      .then(() => onAssigned())
      .catch(() => enqueueSnackbar(intl.formatMessage({ id: 'pages.messages.error.assigned' }), { variant: 'error' }));
  }, [pages]);

  return (
    <ButtonWithTooltip
      variant="outlined"
      tooltip={<FormattedMessage id="page.assignedToMe.label" />}
      disabled={pages.length < 1}
      onClick={onAssignToMe}
    >
      <AssignmentIndIcon />
    </ButtonWithTooltip>
  );
};

AssignToMeButton.defaultProps = {
  pages: null,
  onAssigned: () => {},
  onAssigning: () => {},
};

AssignToMeButton.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.shape({
    sequenceNumber: PropTypes.number,
    links: PropTypes.shape({
      assign_to_me: PropTypes.string,
    }),
  })),
  onAssigned: PropTypes.func,
  onAssigning: PropTypes.func,
};

export default AssignToMeButton;
