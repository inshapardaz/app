import { Button, Container, Toolbar } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useIntl } from "react-intl";

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

import Editor from 'for-editor'

import { libraryService } from '../../services';


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
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();
	const { bookId, chapterNumber } = useParams();
	const [chapter, setChapter] = useState(null);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [language, setLanguage] = useState("ur");
	const [font, setFont] = useState('Dubai');
	const [text, setText] = useState("");
	const [content, setContent] = useState(null);
	const classes = useStyles({ font });

	const loadChapter = () => {
		var editorFont = localStorage.getItem('editorFont');
		if (editorFont == null) {
			setFont('Dubai');
			localStorage.setItem('editorFont', 'Dubai');
		}

		libraryService.getChapter(bookId, chapterNumber)
			.then(chapter => {
				setChapter(chapter);

				if (chapter.links.add_content)
					loadChapterContent(chapter);
				else {
					return Promise.reject("user not allowed to edit");
				}
			})
			.catch(() => setError(true))
			.finally(() => setLoading(false));
	};

	const loadChapterContent = (chapter) => {
		libraryService.getChapterContents(bookId, chapter.chapterNumber, language)
			.then(data => {
				setContent(data);
				setText(data.text)
			})
			.catch((e) => {
				if (e.status === 404) {
					enqueueSnackbar(intl.formatMessage({ id: 'chapter.messages.addingContent' }), { variant: 'info' })
					setContent(null);
					setText("");
				}
				else {
					console.dir(e);
					enqueueSnackbar(intl.formatMessage({ id: 'chapter.messages.error.loading' }), { variant: 'error' })
				}
			})
			.finally(() => setLoading(false));
	}

	useEffect(() => {
		loadChapter();
	}, [chapterNumber]);

	const saveText = () => {
		if (content == null) {
			//  Adding new content
			libraryService.post(`${chapter.links.add_content}?language=${language}`, text)
				.then(data => {
					enqueueSnackbar(intl.formatMessage({ id: 'chapter.messages.saved' }), { variant: 'success' })
				})
				.catch(() => enqueueSnackbar(intl.formatMessage({ id: 'chapter.messages.error.saving' }), { variant: 'error' }))
				.finally(() => setLoading(false));
		}
		else {
			// Updating new content
			libraryService.put(`${content.links.update}?language=${language}`, text)
				.then(data => {
					enqueueSnackbar(intl.formatMessage({ id: 'chapter.messages.saved' }), { variant: 'success' })
				})
				.catch(() => enqueueSnackbar(intl.formatMessage({ id: 'chapter.messages.error.saving' }), { variant: 'error' }))
				.finally(() => setLoading(false));
		}


	}

	const handleFontChange = (event) => {
		let selectedFont = event.target.value;
		setFont(selectedFont);
		localStorage.setItem('editorFont', selectedFont);
	};
	return (<Container >
		{/* <AppBar position="static" color='transparent'>
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
		</AppBar> */}
		<Editor value={text} onChange={(value) => setText(value)} placeholder="" language="en" onSave={saveText} />
	</Container>);
};

export default ChapterEditorPage;
