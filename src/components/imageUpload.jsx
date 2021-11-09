import React, { useState } from 'react';

// MUI
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

const ImageUpload = ({
  imageUrl, defaultImage, height, onImageSelected, readOnly,
}) => {
  let inputElement = null;
  const [newImage, setNewImage] = useState(null);

  const onImageClicked = () => {
    if (!readOnly) {
      inputElement.click();
    }
  };
  const onImageChanged = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      onImageSelected && onImageSelected(file);
      if (FileReader) {
        const fr = new FileReader();
        fr.onload = function () {
          setNewImage(fr.result);
        };
        fr.readAsDataURL(file);
      }
    }
  };

  const setDefaultImage = (ev) => {
    ev.target.src = defaultImage;
  };

  const image = newImage !== null ? newImage : imageUrl || defaultImage;

  return (
    <Box sx={{
      position: 'relative',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: (props) => (props.readOnly ? 'default' : 'pointer'),
    }}
    >
      <Paper
        variant="outlined"
        onClick={onImageClicked}
      >
        <img
          src={image}
          style={{
            display: 'block',
            height: 'auto',
            maxWidth: '100%',
          }}
          height={height}
          width={height * 0.7}
          onError={setDefaultImage}
          alt="preview"
        />
      </Paper>
      <input
        id="file"
        name="file"
        type="file"
        style={{ display: 'none' }}
        accept="image/*"
        ref={(input) => { inputElement = input; }}
        onChange={onImageChanged}
      />
    </Box>
  );
};

export default ImageUpload;
