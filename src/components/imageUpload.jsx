import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PublishIcon from '@material-ui/icons/Publish';

const useStyles = makeStyles(() => ({
	container: {
		position: 'relative',
		width: '100%',
		cursor: props => props.readOnly ? 'default' : 'pointer'
	},

	image: {
		display: 'block',
		width: '100%',
		height: 'auto'
	},

	overlay: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		height: '100%',
		width: '100%',
		opacity: 0,
		transition: '.5s ease',
		backgroundColor: 'black',
		"&:hover": {
			opacity: 0.8
		}
	},
	text: {
		color: 'white',
		fontSize: '20px',
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		textAlign: 'center'
	},
	upload: {
		display: 'none'
	}
}));

const ImageUpload = ({ imageUrl, defaultImage, height, onImageSelected, readOnly }) => {
	const classes = useStyles({ readOnly });
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

	const setDefaultImage = (ev) => {
		ev.target.src = defaultImage;
	};

	const image = newImage !== null ? newImage : imageUrl ? imageUrl : defaultImage;

	return (
		<div className={classes.container}>
			<img src={image} height={height} width={height * 0.7} onError={setDefaultImage} />
			<div className={classes.overlay} onClick={onImageClicked}>
				<div className={classes.text}><PublishIcon /></div>
			</div>
			<input id="file" name="file" type="file" className={classes.upload}
				accept="image/*"
				ref={input => inputElement = input} onChange={onImageChanged}
			/>
		</div>
	);
};

export default ImageUpload;
