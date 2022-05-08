import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// MUI
import { styled, alpha } from '@mui/material/styles';
import { Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// Local Imports
import ButtonWithTooltip from '@/components/buttonWithTooltip';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

const CorrectionMenu = ({ onCorrectionClick }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (val) => {
    handleClose();
    onCorrectionClick(val);
  };
  return (
    <>
      <ButtonWithTooltip
        aria-controls={open ? 'correction-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        startIcon={<AutoAwesomeIcon />}
        endIcon={<KeyboardArrowDownIcon />}
        tooltip="auto correct"
      >
        <FormattedMessage id="correction.profile.label" />
      </ButtonWithTooltip>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{ 'aria-labelledby': 'demo-customized-button' }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleSelect(0)} disableRipple>
          <AutoAwesomeIcon />
          <FormattedMessage id="corrections.profile.punctuation" />
        </MenuItem>
        <MenuItem onClick={() => handleSelect(1)} disableRipple>
          <AutoAwesomeIcon />
          <FormattedMessage id="corrections.profile.autoCorrect" />
        </MenuItem>
      </StyledMenu>
    </>
  );
};

CorrectionMenu.defaultProps = {
  onCorrectionClick: () => {},
};
CorrectionMenu.propTypes = {
  onCorrectionClick: PropTypes.func,
};

export default CorrectionMenu;
