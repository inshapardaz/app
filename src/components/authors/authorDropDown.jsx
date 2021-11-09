import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

// MUI
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

// Local import
import { libraryService } from '@/services';

const AuthorDropDown = ({
  onAuthorSelected, error, value, label, variant,
}, props) => {
  const intl = useIntl();
  const [options, setOptions] = React.useState([]);
  const [text, setText] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const library = useSelector((state) => state.libraryReducer.library);

  useEffect(() => {
    if (library != null) {
      setLoading(true);
      libraryService.getAuthors(library.links.authors, text, 1, 10)
        .then((response) => setOptions(response.data))
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));
    }
  }, [library, text]);

  const getOptionLabel = (option) => (option ? option.name : '');
  const getOptionSelected = (option, val) => option.id === val.id;

  return (
    <Autocomplete
      {...props}
      multiple
      filterSelectedOptions
      options={options}
      loading={loading}
      value={value}
      onChange={(event, newValue) => onAuthorSelected(newValue)}
      isOptionEqualToValue={getOptionSelected}
      getOptionLabel={getOptionLabel}
      noOptionsText={intl.formatMessage({ id: 'authors.messages.empty' })}
      onInputChange={(e, val) => setText(val)}
      renderInput={(params) => (
        <TextField {...params} label={label} error={error} variant={variant} />)}
    />
  );
};

AuthorDropDown.defaultProps = {
  value: null,
  label: null,
  error: null,
  variant: '',
  props: null,
};
AuthorDropDown.propTypes = {
  value: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  })),
  label: PropTypes.node,
  error: PropTypes.node,
  variant: PropTypes.string,
  props: PropTypes.string,
  onAuthorSelected: PropTypes.func.isRequired,
};
export default AuthorDropDown;
