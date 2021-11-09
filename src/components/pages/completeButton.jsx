import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSnackbar } from 'notistack';

// MUI
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import DoneIcon from '@mui/icons-material/Done';

// Local Import
import { libraryService } from '@/services';
import PageStatus from '@/models/pageStatus';
import ButtonWithTooltip from '@/components/buttonWithTooltip';

const CompleteButton = ({ page, onUpdated, onUpdating }) => {
  const [busy, setBusy] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const intl = useIntl();

  let icon = null;
  let newStatus = null;

  if (!page) return null;

  if (page.status === PageStatus.Typing) {
    newStatus = PageStatus.Typed;
    icon = <SpellcheckIcon />;
  } else if (page.status === PageStatus.InReview) {
    newStatus = PageStatus.Completed;
    icon = <DoneIcon />;
  } else {
    return null;
  }

  const onComplete = () => {
    if (page.links.update && newStatus) {
      setBusy(true);
      onUpdating(true);
      page.status = newStatus;
      libraryService.updatePage(page.links.update, page)
        .then(() => enqueueSnackbar(intl.formatMessage({ id: 'page.messages.saved' }), { variant: 'success' }))
        .then(() => onUpdated && onUpdated())
        .catch(() => enqueueSnackbar(intl.formatMessage({ id: 'page.messages.error.saving' }), { variant: 'error' }))
        .finally(() => {
          setBusy(false);
          onUpdating(false);
        });
    }
  };

  return (
    <ButtonWithTooltip
      variant="contained"
      onClick={onComplete}
      disabled={busy}
      tooltip={<FormattedMessage id="action.done" />}
    >
      {icon}
    </ButtonWithTooltip>
  );
};

CompleteButton.defaultProps = {
  page: null,
  onUpdated: () => {},
  onUpdating: () => {},
};

CompleteButton.propTypes = {
  page: PropTypes.shape({
    sequenceNumber: PropTypes.number,
    status: PropTypes.string,
    links: PropTypes.shape({
      update: PropTypes.string,
    }),
  }),
  onUpdated: PropTypes.func,
  onUpdating: PropTypes.func,
};

export default CompleteButton;
