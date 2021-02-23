import { Container } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useIntl, FormattedMessage } from "react-intl";

import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DescriptionIcon from '@material-ui/icons/Description';
import { makeStyles } from '@material-ui/core/styles';
import ChapterDropdown from '../../components/chapters/chapterDropDown';

import Loading from '../../components/Loading';
import Reader from '../../components/reader';
import ErrorMessage from '../../components/ErrorMessage';
import { libraryService } from '../../services';
import FontDropdown from '../../components/fontDropDown';
import FontSize from '../../components/fontSize';
import HideOnScroll from '../../components/hideOnScroll';
import BackToTop from '../../components/backToTop';

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
	const [language] = useState("ur");
	const [font, setFont] = useState(localStorage.getItem('viewerFont') || 'Dubai');
	const [fontSize, setFontSize] = useState(localStorage.getItem('viewerFontSize') || 1);
	const [text, setText] = useState(null);
	const [content, setContent] = useState(null);
	const classes = useStyles({ font, fontSize });

	const loadChapter = () => {
		setChapter(null);
		setContent(null);
		setText(null);
		setLoading(true);
		setError(false);

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

	const renderContents = () => {
		if (text === null) {
			return (<ErrorMessage message={intl.formatMessage({ id: 'chapter.messages.error.noContent' })} />);
		}
		return (
			<>
				<Reader data={text} format="markdown" />
				<BackToTop />
			</>);
	}

	if (loading) {
		<Loading />
	}

	if (error) {
		<ErrorMessage message={intl.formatMessage({ id: 'chapter.messages.error.loading' })} />
	}

	return (<Container maxWidth="md">
		<HideOnScroll>
			<AppBar position="static" color='transparent' elevation={0} variant="outlined">
				<Toolbar>
					<ChapterDropdown bookId={bookId} title={chapter && chapter.title} navigate={true} />
					{renderToolbar()}
					<Divider />
					<FontDropdown value={font} onFontSelected={handleFontChange} storageKey="viewerFont" />
					<FontSize value={fontSize} onFontSizeSelected={handleFontSizeChange} storageKey="viewerFontSize" />
				</Toolbar>
			</AppBar>
		</HideOnScroll>
		<div className={classes.viewer}>
			<h1 className={classes.heading}>
				{chapter && chapter.title}
			</h1>
			{renderContents()}
		</div>
	</Container >);
};

export default ChapterViewerPage;
