import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// MUI
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LayersIcon from '@mui/icons-material/Layers';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// Local Imports
import { libraryService } from '@/services/';
import BreadcrumbSeparator from '@/components/breadcrumbSeparator';

const ChapterBreadcrumb = ({ book, chapter }) => {
  const [chapters, setChapters] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    if (book && chapters === null) {
      libraryService.getBookChapters(book.links.chapters)
        .then((res) => setChapters(res));
    }
  }, [book]);

  return (
    <>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<BreadcrumbSeparator />}
      >
        <Link
          underline="hover"
          color="inherit"
          style={{ display: 'flex', alignItems: 'center' }}
          to={`/books/${book.id}`}
        >
          <MenuBookIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          {book && book.title}
        </Link>
        <Button
          id="chapters-button"
          aria-controls="chapters-menu"
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          startIcon={<LayersIcon />}
          endIcon={<KeyboardArrowDownIcon />}
        >
          {chapter.title}
        </Button>
      </Breadcrumbs>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
      >
        {chapters && chapters.data.map((c) => (
          <MenuItem
            key={c.id}
            selected={chapter.id === c.id}
            component={Link}
            to={`/books/${book.id}/chapters/${c.chapterNumber}/edit`}
            onClick={handleClose}
          >
            <LayersIcon />
            {c.title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

ChapterBreadcrumb.defaultProps = {
  book: { id: 0, title: '' },
  chapter: { title: '' },
};

ChapterBreadcrumb.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    links: PropTypes.shape({
      chapters: PropTypes.string,
    }),
  }),
  chapter: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
  }),
};

export default ChapterBreadcrumb;
