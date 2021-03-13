import React, { useState } from 'react';

const ImageUpload = ({ imageUrl, defaultImage, height, onImageSelected, readOnly }) => {
	let inputElement = null;
	const [newImage, setNewImage] = useState(null);

	const onImageClicked = () => {
		if (!readOnly) {
			inputElement.click();
		}
	}
	const onImageChanged = (event) => {
		var file = event.currentTarget.files[0];
		if (file) {
			onImageSelected && onImageSelected(file);
			if (FileReader) {
				var fr = new FileReader();
				fr.onload = function () {
					setNewImage(fr.result);
				}
				fr.readAsDataURL(file);
			}
		}
	};

	const image = newImage !== null ? newImage : imageUrl ? imageUrl : defaultImage;
	const imageStyle = { height, width: height * 0.7 };
	if (!readOnly)
		imageStyle.cursor = 'pointer';

	return (
		<>
			<img src={image} style={imageStyle} onClick={onImageClicked} />
			<input id="file" name="file" type="file" style={{ display: 'none' }}
				ref={input => inputElement = input} onChange={onImageChanged}
			/>
		</>);
};

export default ImageUpload;
