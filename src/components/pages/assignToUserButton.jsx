import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// MUI
import PersonAddIcon from '@mui/icons-material/PersonAdd';

// Local imports
import ButtonWithTooltip from '@/components/buttonWithTooltip';
import AssignmentDialog from '@/components/pages/assignmentDialog';

const PagePagesAssignButton = ({ pages, onAssigned }) => {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <>
      <ButtonWithTooltip
        variant="outlined"
        tooltip={<FormattedMessage id="pages.assignToUser" />}
        disabled={pages.length < 1}
        onClick={handleClickOpen}
      >
        <PersonAddIcon />
      </ButtonWithTooltip>
      <AssignmentDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        onAssigned={onAssigned}
        pages={pages}
      />
    </>

  );
};

PagePagesAssignButton.defaultProps = {
  pages: [],
  onAssigned: () => {},
};

PagePagesAssignButton.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.shape({
    sequenceNumber: PropTypes.number,
    assignStatus: PropTypes.string,
  })),
  onAssigned: PropTypes.func,
};

export default PagePagesAssignButton;
