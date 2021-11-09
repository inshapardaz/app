import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSnackbar } from 'notistack';

// MUI
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LayersIcon from '@mui/icons-material/Layers';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';

// Local Imports
import { libraryService } from '@/services';
import ButtonWithTooltip from '@/components/buttonWithTooltip';

const ChapterAssignButton = ({
  book, pages, onStatusChanges, onBusy,
}) => {
  const intl = useIntl();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [chapters, setChapters] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (book) {
      libraryService.getBookChapters(book.links.chapters)
        .then((res) => setChapters(res));
    }
  }, [book]);

  const onSelected = (chapter) => {
    handleClose();
    onBusy(true);
    const promises = [];

    pages.map((page) => {
      if (page !== null && page !== undefined) {
        if (page.links.update) {
          page.chapterId = chapter.id;
          return promises.push(libraryService.updatePage(page.links.update, page));
        }
      }
      return Promise.resolve();
    });

    Promise.all(promises)
      .then(() => enqueueSnackbar(intl.formatMessage({ id: 'page.messages.saved' }), { variant: 'success' }))
      .then(() => onBusy(true))
      .then(() => onStatusChanges())
      .catch(() => enqueueSnackbar(intl.formatMessage({ id: 'page.messages.error.saving' }), { variant: 'error' }));
  };

  return (
    <>
      <ButtonWithTooltip
        variant="outlined"
        tooltip={<FormattedMessage id="pages.associateWithChapter" />}
        disabled={pages.length < 1}
        onClick={handleClick}
        startIcon={<KeyboardArrowDownIcon />}
      >
        <LayersIcon />
      </ButtonWithTooltip>
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
            onClick={() => onSelected(c)}
            value={c.id}
          >
            <ListItemIcon><LayersOutlinedIcon /></ListItemIcon>
            {c.title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

ChapterAssignButton.defaultProps = {
  book: null,
  pages: null,
  onStatusChanges: () => {},
  onBusy: () => {},
};

ChapterAssignButton.propTypes = {
  book: PropTypes.shape({
    links: PropTypes.shape({
      chapters: PropTypes.string,
    }),
  }),
  pages: PropTypes.arrayOf(PropTypes.shape({
    sequenceNumber: PropTypes.number,
    links: PropTypes.shape({
      update: PropTypes.string,
    }),
  })),
  onBusy: PropTypes.func,
  onStatusChanges: PropTypes.func,
};

export default ChapterAssignButton;
