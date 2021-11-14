import React from 'react';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

// MUI
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CategoryIcon from '@mui/icons-material/Category';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Divider from '@mui/material/Divider';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
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

const CategoriesMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const categories = useSelector((state) => state.libraryReducer.categories);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderCategories = () => {
    if (categories && categories.data) {
      const cats = categories.data.map((c) => (
        <MenuItem key={c.id} onClick={handleClose} disableRipple component={Link} to={`/books?category=${c.id}`}>{c.name}</MenuItem>
      ));

      if (categories.links.create) {
        if (cats.length > 0) cats.push(<Divider key="categories-divider" />);
        cats.push(<MenuItem key="categories-page" disableRipple onClick={handleClose} component={Link} to="/categories"><FormattedMessage id="header.categories" /></MenuItem>);
      }

      return cats;
    }

    return null;
  };

  if (categories && categories.data.length < 1) {
    return (
      <Button
        data-ft="categories-link"
        aria-label="categories"
        color="inherit"
        component={Link}
        to="/categories"
        xs={{ margin: (theme) => theme.spacing(1) }}
        startIcon={<CategoryIcon />}
      >
        <FormattedMessage id="header.categories" />
      </Button>
    );
  }
  return (
    <>
      <Button
        aria-controls="categories-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        data-ft="categories-menu"
        color="inherit"
        onClick={handleClick}
        startIcon={<CategoryIcon />}
        endIcon={<KeyboardArrowDownIcon />}
      >
        <FormattedMessage id="header.categories" />
      </Button>
      <StyledMenu
        id="categories-menu"
        MenuListProps={{ 'aria-labelledby': 'categories-button' }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {renderCategories()}
      </StyledMenu>
    </>
  );
};

export default CategoriesMenu;
