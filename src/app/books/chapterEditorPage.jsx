import { Button, Container, Toolbar } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import SaveIcon from '@material-ui/icons/Save';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import FontDownloadIcon from '@material-ui/icons/FontDownload';

import MarkdownIt from 'markdown-it'
import ContentEditable from 'react-contenteditable'

import { libraryService } from '../../services';

const Editable = ({ onChange, editorStyle, content }) => {
	const md = new MarkdownIt('default', {
		html: true,
		linkify: true,
		typographer: true
	})
	const emitChange = event => {
		const { innerHTML } = event.target

		if (innerHTML !== '') {
			console.log(md.render(innerHTML))
			onChange(innerHTML)
		}
	}

	return (
		<Container>
			<ContentEditable
				style={editorStyle}
				html={md.render(content)}
				onChange={emitChange}
			/>
		</Container>
	)
}


const useStyles = makeStyles({
	editor: {
		fontFamily: props => props.font,
		position: 'relative',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		margin: 24
	}
});

const ChapterEditorPage = () => {
	const { bookId, id } = useParams();
	const [chapter, setChapter] = useState(null);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [font, setFont] = React.useState('Dubai');
	const [text, setText] = React.useState("test");
	const classes = useStyles({ font });
	const loadData = () => {
		var editorFont = localStorage.getItem('editorFont');
		if (editorFont == null) {
			setFont('Dubai');
			localStorage.setItem('editorFont', 'Dubai');
		}
		libraryService.getChapterContents(bookId, id)
			.then(data => {
				setChapter(data);
				let content = data && data.contents;
				console.log(content)
				setText()
			})
			.catch(() => setError(true))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		loadData();
	}, [id]);

	const handleFontChange = (event) => {
		let selectedFont = event.target.value;
		setFont(selectedFont);
		localStorage.setItem('editorFont', selectedFont);
	};
	return (<Container >
		<AppBar position="static" color='transparent'>
			<Toolbar>
				<Button><SaveIcon /></Button>
				<Divider />
				<Button><FormatBoldIcon /></Button>
				<Button><FormatItalicIcon /></Button>
				<Button><FormatUnderlinedIcon /></Button>
				<Divider />
				<Select
					labelId="demo-controlled-open-select-label"
					id="demo-controlled-open-select"
					value={font}
					onChange={handleFontChange}
				>
					<MenuItem value="Fajer Noori Nastalique">Fajer Noori Nastalique</MenuItem>
					<MenuItem value="Pak Nastaleeq">Pak Nastaleeq</MenuItem>
					<MenuItem value="Nafees Web Naskh">Nafees Web Naskh</MenuItem>
					<MenuItem value="Nafees-Nastaleeq">Nafees Nastaleeq</MenuItem>
					<MenuItem value="Mehr-Nastaleeq">Mehr Nastaleeq</MenuItem>
					<MenuItem value="DehalviKhushKhat">Dehalvi KhushKhat</MenuItem>
					<MenuItem value="AdobeArabic">Adobe Arabic</MenuItem>
					<MenuItem value="MehfilNaskh">Mehfil Naskh</MenuItem>
					<MenuItem value="Dubai">Dubai</MenuItem>
					<MenuItem value="UrduNaskhAsiatype">Urdu Naskh Asiatype</MenuItem>
					<MenuItem value="Noto">Noto</MenuItem>
					<MenuItem value="Alvi Lahori Nastaleeq">Alvi Lahori Nastaleeq</MenuItem>
					<MenuItem value="Jameel Noori Nastaleeq">Jameel Noori Nastaleeq</MenuItem>
				</Select>
			</Toolbar>
		</AppBar>
		{text}
		{/* <Editable onChange={(content) => { }} content={text} /> */}
		{/* <TextField
			id="outlined-multiline-static"
			className={classes.editor}
			multiline
			fullWidth={true}
			defaultValue={chapter && chapter.contents}
		/> */}
	</Container>);
};

export default ChapterEditorPage;
