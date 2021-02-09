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
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ReactMarkdown from 'react-markdown'
import ChapterDropdown from '../../components/chapters/chapterDropDown';

import { libraryService } from '../../services';
import FontDropdown from '../../components/fontDropDown';
import FontSize from '../../components/fontSize';


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
	},
	heading: {
		fontSize: '3em',
		textAlign: "center"
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
	const [font, setFont] = useState(localStorage.getItem('viewerFont') || 'Dubai');
	const [fontSize, setFontSize] = useState(localStorage.getItem('viewerFontSize') || 1);
	const [text, setText] = useState(null);
	const [content, setContent] = useState(null);
	const classes = useStyles({ font, fontSize });

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

	const handleFontChange = (selectedFont) => {
		setFont(selectedFont);

	};

	const handleFontSizeChange = (selectedFontSize) => {
		setFontSize(selectedFontSize);
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

	return (<Container maxWidth="md">
		<AppBar position="static" color='transparent'>
			<Toolbar>
				<ChapterDropdown bookId={bookId} title={<FormattedMessage id={"chapter.toolbar.chapters"} navigate={true} />} />
				{renderToolbar()}
				<Divider />
				<FontDropdown value={font} onFontSelected={handleFontChange} storageKey="viewerFont" />
				<FontSize value={font} onFontSizeSelected={handleFontSizeChange} storageKey="viewerFontSize" />
			</Toolbar>
		</AppBar>
		<div className={classes.viewer}>
			<h1 className={classes.heading}>
				{chapter.title}
			</h1>
			<ReactMarkdown>{text}</ReactMarkdown>
		</div>
	</Container >);
};

export default ChapterViewerPage;
