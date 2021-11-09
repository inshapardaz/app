import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

// MUI
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

// Local Import
import { libraryService } from '@/services';

const WritersDropDown = ({
  onWriterSelected, error, value, label,
}, props) => {
  const intl = useIntl();
  const [options, setOptions] = React.useState([]);
  const [text, setText] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [loadingError, setLoadingError] = React.useState(false);
  const library = useSelector((state) => state.libraryReducer.library);

  useEffect(() => {
    (() => {
      setLoading(true);
      libraryService.getWriters(library.id, text === value && value.name ? null : text)
        .then((response) => setOptions(response))
        .catch(() => setLoadingError(true))
        .finally(() => setLoading(false));
    })();
  }, [text]);

  return (
    <Autocomplete
      {...props}
      options={options}
      loading={loading}
      value={value}
      onChange={(event, newValue) => onWriterSelected(newValue)}
      getOptionSelected={(option, val) => option.id === val.id}
      getOptionLabel={(option) => (option ? `${option.name}` : '')}
      noOptionsText={intl.formatMessage({ id: 'person.messages.empty' })}
      onInputChange={(e, val) => setText(val)}
      renderInput={(params) => <TextField {...params} label={label} error={error || loadingError} variant="outlined" />}
    />
  );
};

WritersDropDown.defaultProps = {
  label: null,
  value: null,
  error: false,
  onWriterSelected: () => {},
};

WritersDropDown.propTypes = {
  label: PropTypes.node,
  value: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
  error: PropTypes.bool,
  onWriterSelected: PropTypes.func,
};
export default WritersDropDown;
