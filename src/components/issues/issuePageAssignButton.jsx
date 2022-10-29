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

const IssuePageAssignButton = ({
  issue, pages, onStatusChanges, onBusy,
}) => {
  const intl = useIntl();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [articles, setArticles] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (issue) {
      libraryService.getIssueArticles(issue.links.articles)
        .then((res) => setArticles(res));
    }
  }, [issue]);

  const onSelected = (article) => {
    handleClose();
    onBusy(true);
    const promises = [];

    pages.map((page) => {
      if (page !== null && page !== undefined) {
        if (page.links.update) {
          page.articleNumber = article.id;
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
        {articles && articles.data.map((c) => (
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

IssuePageAssignButton.defaultProps = {
  issue: null,
  pages: null,
  onStatusChanges: () => {},
  onBusy: () => {},
};

IssuePageAssignButton.propTypes = {
  issue: PropTypes.shape({
    links: PropTypes.shape({
      articles: PropTypes.string,
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

export default IssuePageAssignButton;
