import React from 'react';
import { useSelector } from 'react-redux';

// MUI
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

// Local imports
import { libraryService } from '@/services';

const SeriesDropDown = ({ label, value, onSeriesSelected }, props) => {
  const [options, setOptions] = React.useState([]);
  const [text, setText] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const library = useSelector((state) => state.libraryReducer.library);

  React.useEffect(() => {
    if (library) {
      setLoading(true);
      libraryService.getSeries(library.links.series, text, 1, 10)
        .then((response) => setOptions(response.data))
        .catch((e) => console.error(e))
        .finally(() => setLoading(false));
    }
  }, [library, text]);

  return (
    <Autocomplete
      {...props}
      options={options}
      loading={loading}
      value={value}
      onChange={(event, newValue) => onSeriesSelected(newValue)}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      getOptionLabel={(option) => option.name}
      onInputChange={(e, val) => setText(val)}
      renderInput={(params) => <TextField {...params} label={label} variant="outlined" />}
    />
  );
};

export default SeriesDropDown;
