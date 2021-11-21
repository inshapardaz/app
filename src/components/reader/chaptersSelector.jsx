import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// MUI
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// Local Imports
import { libraryService } from '@/services/';

const ChaptersSelector = ({ book, selectedChapter }) => {
  const [chapters, setChapters] = useState(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const loadData = () => {
    setBusy(true);
    setError(false);

    libraryService.getBookChapters(book.links.chapters)
      .then((res) => setChapters(res))
      .then(() => setBusy(false))
      .catch(() => {
        setBusy(false);
        setError(true);
      });
  };

  useEffect(() => {
    if (book) {
      loadData();
    }
  }, [book]);

  if (!book || !selectedChapter || !chapters) return null;

  return (
    <>
      <Button
        id="chapter-button"
        aria-controls={open ? 'chapter-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        size="small"
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {selectedChapter.title}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
      >
        {!busy && !error && chapters.data.map((c) => (
          <MenuItem
            key={c.id}
            component={Link}
            to={`/books/${book.id}/chapters/${c.chapterNumber}`}
            value={c.key}
            selected={selectedChapter.id === c.id}
            onClick={handleClose}
          >
            {c.title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

ChaptersSelector.defaultProps = {
  book: null,
  selectedChapter: null,
};

ChaptersSelector.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.number,
    links: PropTypes.shape({
      chapters: PropTypes.string,
    }),
  }),
  selectedChapter: PropTypes.shape({
    id: PropTypes.number,
    chapterNumber: PropTypes.number,
    title: PropTypes.string,
  }),
};

export default ChaptersSelector;
