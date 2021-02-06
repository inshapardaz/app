import { Container } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useIntl, FormattedMessage } from "react-intl";

import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Select from '@material-ui/core/Select';
import Toolbar from '@material-ui/core/Toolbar';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DescriptionIcon from '@material-ui/icons/Description';

import { makeStyles } from '@material-ui/core/styles';
import ReactMarkdown from 'react-markdown'

import { libraryService } from '../../services';


const useStyles = makeStyles({
	viewer: {
		fontFamily: props => props.font,
		fontSize: props => `${props.fontSize}em`,
		position: 'relative',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		margin: 24
	}
});

const ChapterViewerPage = () => {
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();
	const { bookId, chapterNumber } = useParams();
	const [chapter, setChapter] = useState(null);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [language, setLanguage] = useState("ur");
	const [font, setFont] = useState('Dubai');
	const [fontSize, setFontSize] = useState(1);
	const [text, setText] = useState(null);
	const [content, setContent] = useState(null);
	const classes = useStyles({ font, fontSize });

	var editorFont = localStorage.getItem('viewerFont');
	if (editorFont == null) {
		setFont('Dubai');
		localStorage.setItem('viewerFont', 'Dubai');
	}

	var editorFontSize = localStorage.getItem('viewerFontSize');
	if (editorFontSize == null) {
		editorFontSize = '1';
		setFontSize(editorFontSize);
		localStorage.setItem('viewerFontSize', editorFontSize);
	}

	const loadChapter = () => {
		libraryService.getChapter(bookId, chapterNumber)
			.then(chapter => {
				setChapter(chapter);

				if (chapter.contents.length > 0 && chapter.contents[0].links.self)
					loadChapterContent(chapter);
				else {
					return Promise.reject("user not allowed to edit");
				}
			})
			.catch(() => setError(true))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		loadChapter();
	}, [chapterNumber]);

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

	const handleFontChange = (event) => {
		let selectedFont = event.target.value;
		setFont(selectedFont);
		localStorage.setItem('viewerFont', selectedFont);
	};

	const handleFontSizeChange = (event) => {
		let selectedFontSize = event.target.value;
		setFontSize(selectedFontSize);
		localStorage.setItem('viewerFontSize', selectedFontSize);
	};

	const renderToolbar = () => {
		var buttons = [];

		if (content && content.links.update) {

			buttons.push(
				<Tooltip key="edit" title={<FormattedMessage id="chapter.action.editContent" />} >
					<IconButton edge="end" aria-label="edit contents" href={`/books/${content.bookId}/chapter/${content.chapterNumber}/editor`}>
						<DescriptionIcon />
					</IconButton>
				</Tooltip>);
		}

		return buttons;
	}

	if (text === null) {
		return null;
	}

	return (<Container >
		<AppBar position="static" color='transparent'>
			<Toolbar>
				{renderToolbar()}
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
				<Select
					labelId="demo-controlled-open-select-label"
					id="demo-controlled-open-select"
					value={fontSize}
					onChange={handleFontSizeChange}
				>
					<MenuItem value="0.75">Small</MenuItem>
					<MenuItem value="1">Normal</MenuItem>
					<MenuItem value="1.5">Large</MenuItem>
					<MenuItem value="2">Larger</MenuItem>
					<MenuItem value="2.5">Extra Large</MenuItem>
				</Select>
			</Toolbar>
		</AppBar>
		<div className={classes.viewer}>
			<ReactMarkdown>{text}</ReactMarkdown>
		</div>
	</Container >);
};

export default ChapterViewerPage;
