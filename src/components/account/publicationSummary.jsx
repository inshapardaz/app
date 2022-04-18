import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';

// MUI
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

// Local imports
import { libraryService } from '@/services/';
import PageStatusIcon from '@/components/pages/pageStatusIcon';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const PublicationSummary = () => {
  const library = useSelector((state) => state.libraryReducer.library);
  const [summary, setSummary] = React.useState(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState(false);

  const loadData = () => {
    setBusy(true);
    setError(false);

    libraryService.getUserPublicationsSummary(library.links.my_publishing_summary)
      .then((res) => setSummary(res))
      .catch(() => setError(true))
      .finally(() => setBusy(false));
  };

  useEffect(() => {
    if (library) {
      loadData();
    }
  }, [library]);

  const renderList = () => (
    <List>
      {summary.map((item) => (
        <ListItem disablePadding>
          {/* <ListItemAvatar>
            <Avatar>
              <PageStatusIcon status={item.status} />
            </Avatar>
          </ListItemAvatar> */}
          <ListItemText
            primary={<FormattedMessage id={`status.${capitalizeFirstLetter(item.status)}`} />}
            secondary={<FormattedMessage id="pages.count" values={{ count: item.count }} />}
          />
        </ListItem>
      ))}
    </List>
  );
  return (
    <>
      <Typography variant="h5"><FormattedMessage id="publication.contributions" /></Typography>
      { summary && renderList() }
    </>
  );
};

export default PublicationSummary;
