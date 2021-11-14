import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

// MUI
import CategoryIcon from '@mui/icons-material/Category';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import ListItem from '@mui/material/ListItem';

import {
  List, ListItemButton, ListItemIcon, ListItemText,
} from '@mui/material';

const CategoriesMobileMenu = ({ onClick, onKeyDown }) => {
  const [open, setOpen] = useState(false);
  const categories = useSelector((state) => state.libraryReducer.categories);

  const handleClick = () => {
    setOpen(!open);
  };

  const renderCategories = () => {
    if (categories && categories.data) {
      const cats = categories.data.map((c) => (
        <ListItemButton sx={{ pl: 4 }} key={c.id} component={Link} to={`/books?category=${c.id}`} onClick={onClick} onKeyDown={onKeyDown}>
          <ListItemText primary={c.name} />
        </ListItemButton>
      ));

      if (categories.links.create) {
        if (cats.length > 0) {
          cats.push(<Divider key="categories-divider" />);
        }

        cats.push(
          <ListItemButton sx={{ pl: 4 }} key="categories-page" component={Link} to="/categories" onClick={onClick} onKeyDown={onKeyDown}>
            <ListItemText primary={<FormattedMessage id="header.categories" />} />
          </ListItemButton>,
        );
      }

      return cats;
    }

    return null;
  };

  if (categories && categories.data.length < 1) {
    return (
      <ListItem button key="categories" component={Link} to="/categories" data-ft="categories-link">
        <ListItemIcon>
          <CategoryIcon />
        </ListItemIcon>
        <ListItemText primary={<FormattedMessage id="header.categories" />} />
      </ListItem>
    );
  }

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        data-ft="categories-menu"
      >
        <ListItemIcon>
          <CategoryIcon />
        </ListItemIcon>
        <ListItemText primary={<FormattedMessage id="header.categories" />} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {renderCategories()}
        </List>
      </Collapse>
    </>
  );
};

CategoriesMobileMenu.defaultProps = {
  onClick: () => {},
  onKeyDown: () => {},
};

CategoriesMobileMenu.propTypes = {
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
};
export default CategoriesMobileMenu;
