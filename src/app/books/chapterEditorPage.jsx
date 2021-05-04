import { Button, Container, Toolbar } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { FormattedMessage, useIntl } from "react-intl";

import { makeStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

import AddCircleIcon from '@material-ui/icons/AddCircle';
import BookIcon from '@material-ui/icons/Book';
import LayersIcon from '@material-ui/icons/Layers';
import SaveIcon from '@material-ui/icons/Save';

import ChapterDropdown from '../../components/chapters/chapterDropDown';
import ChapterEditor from '../../components/chapters/chapterEditor';
import { libraryService } from '../../services';
import Editor from '../../components/editor';


const useStyles = makeStyles((theme) => ({
	editor: {
		fontFamily: props => props.font,
		position: 'relative',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		margin: 24
	},
	icon: {
		marginRight: theme.spacing(0.5),
		width: 20,
		height: 20,
	},
}));

const ChapterEditorPage = () => {
	const intl = useIntl();
	const history = useHistory();
	const { enqueueSnackbar } = useSnackbar();
	const { bookId, chapterNumber } = useParams();
	const [book, setBook] = useState(null);
	const [chapters, setChapters] = useState(null);
	const [chapter, setChapter] = useState(null);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [showAdd, setShowAdd] = useState(false);
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

		libraryService.getBook(bookId)
			.then(book => {
				setBook(book);

				libraryService
					.getBookChapters(book)
					.then((data) => {
						setChapters(data);
					})
					.catch(() => setError(true))
					.finally(() => setLoading(false));
			})
			.catch(() => setError(true))

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
					setContent(data);
					setText(data.text);
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

	const addChapter = () => {
		setShowAdd(true);
	}
	const handleClose = () => {
		setShowAdd(false);
	}
	const chapterCreated = (c) => {
		handleClose();
		history.push(`/books/${bookId}/chapter/${c.chapterNumber}/editor`);
	}

	return (<Container >
		<Toolbar>
			<Breadcrumbs aria-label="breadcrumb" separator="›">
				{book && <Link color="inherit" to={`/books/${book.id}/chapters`}><BookIcon className={classes.icon} />{book.title}</Link>}
				<ChapterDropdown chapters={chapters && chapters.data} title={<> <LayersIcon className={classes.icon} /> {chapter && chapter.title}</>} onChapterSelected={(c) => history.push(`/books/${bookId}/chapter/${c.chapterNumber}/editor`)} />
			</Breadcrumbs>

			<Button onClick={addChapter}>
				<AddCircleIcon /> <FormattedMessage id="chapter.action.create" />
			</Button>
			<Button onClick={saveText}>
				<SaveIcon /> <FormattedMessage id="action.save" />
			</Button>
		</Toolbar>

		<Editor data={text} onChange={content => setText(content)} />

		<ChapterEditor
			show={showAdd}
			createLink={book && book.links.create_chapter}
			chapter={null}
			chapterCount={chapters && chapters.data.length}
			onSaved={chapterCreated}
			onCancelled={handleClose}
		/>
	</Container>);
};

export default ChapterEditorPage;
