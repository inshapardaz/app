import React from 'react';
import { useSelector } from 'react-redux';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const CategoriesDropDown = ({ label, value, onCategoriesSelected }, props) => {
  const categories = useSelector((state) => state.libraryReducer.categories);

  return (
    <Autocomplete
      {...props}
      multiple
      loading={categories !== null}
      filterSelectedOptions
      options={categories ? categories.data : []}
      value={value}
      onChange={(event, newValue) => onCategoriesSelected(newValue)}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => <TextField {...params} label={label} variant="outlined" />}
    />
  );
};

export default CategoriesDropDown;
