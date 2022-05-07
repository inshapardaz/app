import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// MUI
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import LayersIcon from '@mui/icons-material/Layers';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// Local Imports
import { libraryService } from '@/services/';

const ChaptersSelector = ({
  open, book, selectedChapter, onCloseDrawer,
}) => {
  const [chapters, setChapters] = useState(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState(false);

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
    <Drawer anchor="left" open={open} onClose={onCloseDrawer}>
      <List sx={{ width: 250 }}>
        <ListItem>
          <ListItemText primary={book.title} />
        </ListItem>
        <Divider />
        {!busy && !error && chapters.data.map((c) => (
          <ListItem
            key={c.id}
            component={Link}
            to={`/books/${book.id}/chapters/${c.chapterNumber}`}
            value={c.key}
            selected={selectedChapter.id === c.id}
            onClick={onCloseDrawer}
          >
            <ListItemIcon>
              <LayersIcon />
            </ListItemIcon>
            <ListItemText primary={c.title} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

ChaptersSelector.defaultProps = {
  open: false,
  onCloseDrawer: () => {},
  book: null,
  selectedChapter: null,
};

ChaptersSelector.propTypes = {
  open: PropTypes.bool,
  onCloseDrawer: PropTypes.func,
  book: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
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
