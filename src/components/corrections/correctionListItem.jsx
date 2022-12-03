import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

// MUI
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EditIcon from '@mui/icons-material/Edit';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import AbcIcon from '@mui/icons-material/Abc';

// Local Imports
import CorrectionDeleteButton from '@/components/corrections/correctionDeleteButton';

const CorrectionListItem = ({ correction, onDeleted }) => {
  const history = useHistory();

  return (
    <ListItem
      key={correction.incorrectText}
      button
      divider
      secondaryAction={(
        <>
          <Tooltip title={<FormattedMessage id="action.edit" />}>
            <IconButton onClick={() => history.push(`/tools/corrections/${correction.language}/${correction.profile}/${correction.id}/edit`)}><EditIcon /></IconButton>
          </Tooltip>
          <CorrectionDeleteButton correction={correction} onDeleted={onDeleted} />
        </>
)}
    >
      <ListItemIcon>
        { correction.completeWord ? <AbcIcon /> : <SpellcheckIcon /> }
      </ListItemIcon>
      <ListItemText
        primary={correction.incorrectText}
        secondary={correction.correctText}
      />
    </ListItem>
  );
};

CorrectionListItem.propTypes = {
  correction: PropTypes.shape({
    id: PropTypes.number,
    language: PropTypes.string,
    profile: PropTypes.string,
    incorrectText: PropTypes.string,
    correctText: PropTypes.string,
    completeWord: PropTypes.bool,
  }).isRequired,
  onDeleted: PropTypes.func.isRequired,
};

export default CorrectionListItem;
