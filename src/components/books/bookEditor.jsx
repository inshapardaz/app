import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Slide from '@material-ui/core/Slide';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import { DropzoneArea } from 'material-ui-dropzone';
import { FormattedMessage, useIntl } from 'react-intl';
import { FormControl, FormControlLabel, Grid, InputLabel } from '@material-ui/core';
import AuthorDropDown from '../authors/authorDropdown.jsx';
import SeriesDropDown from '../series/seriesDropdown.jsx';
import LibraryService from '../../services/LibraryService';
import LanguageDropDown from '../languageDropDown.jsx';
import CopyrightDropDown from '../copyrightDropDown.jsx';
import CategoriesDropDown from '../categories/categoriesDropdown.jsx';

const useStyles = makeStyles((theme) => ({
	appBar : {
		position : 'relative'
	},
	title : {
		marginLeft : theme.spacing(2),
		flex : 1
	}
}));

const Transition = React.forwardRef(function Transition (props, ref)
{
	return <Slide direction="up" ref={ref} {...props} />;
});

const toCategory = (c) =>
{
	return { id : c };
};

const toCategoryId = (c) =>
{
	return c.id;
};

const BookEditor = ({ show, book, createLink, onSaved, onCancelled  }) =>
{
	const classes = useStyles();
	const intl = useIntl();
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState(false);
	const [title, setTitle] = useState();
	const [description, setDescription] = useState();
	const [yearPublished, setYearPublish] = useState();
	const [authorId, setAuthorId] = useState();
	const [authorName, setAuthorName] = useState();
	const [seriesId, setSeriesId] = useState();
	const [seriesIndex, setSeriesIndex] = useState();
	const [copyrights, setCopyrights] = useState();
	const [language, setLanguage] = useState();
	const [isPublic, setPublic] = useState();
	const [categories, setCategories] = useState([]);

	useEffect(() =>
	{
		setTitle(book === null ? '' : book.title);
		setDescription(book === null ? '' : book.description);
		setYearPublish(book === null ? new Date().getYear() : book.yearPublished);
		setAuthorId(book === null ? null : book.authorId);
		setAuthorName(book === null ? null : book.authorName);
		setSeriesId(book === null ? null : book.seriesId);
		setSeriesIndex(book === null ? null : book.seriesIndex);
		setCopyrights(book === null ? 0 : book.copyrights);
		setLanguage(book === null ? 0 : book.language);
		setPublic(book === null ? false : book.isPublic);
		setCategories(book === null ? false : book.categories.map(toCategoryId));
	}, [book]);

	const handleSave = async () =>
	{
		setBusy(true);
		try
		{
			if (book === null && createLink !== null)
			{
				let obj = {
					title,
					description,
					yearPublished,
					seriesId,
					seriesIndex,
					copyrights,
					language,
					authorId,
					isPublic,
					categories : categories.map(toCategory)
				};
				await LibraryService.post(createLink, obj);
			}
			else if (book !== null)
			{
				let obj = { ...book };
				obj.title = title;
				obj.description = description;
				obj.yearPublished = yearPublished;
				obj.authorId = authorId;
				obj.seriesId = seriesId;
				obj.seriesIndex = seriesIndex;
				obj.copyrights = copyrights;
				obj.language = language;
				obj.isPublic = isPublic;
				obj.categories = categories.map(toCategory);

				console.dir(obj);
				await LibraryService.put(book.links.update, obj);
			}

			onSaved();

		}
		catch (e)
		{
			console.error(e);
			setError(true);
		}
		finally
		{
			setBusy(false);
		}
	};
	const handleImageUpload = async (files) =>
	{
		if (files.length < 1)
		{
			return;
		}

		setBusy(true);
		try
		{
			if (book && book.links.image_upload !== null)
			{
				await LibraryService.upload(book.links.image_upload, files[0]);
			}

			onSaved();

		}
		catch (e)
		{
			console.error(e);
			setError(true);
		}
		finally
		{
			setBusy(false);
		}
	};

	const updateAuthorId = (value) => {
		setAuthorId(value.id);
		setAuthorName(value.name);
	};

	const dialogTitle = book === null ?
		intl.formatMessage({ id : 'book.editor.header.add' }) :
		intl.formatMessage({ id : 'book.editor.header.edit' }, { title : book.title });

	return (
		<Dialog fullScreen open={show}
			onClose={() => onCancelled()}
			TransitionComponent={Transition}
			disableEscapeKeyDown={busy}
			disableBackdropClick={busy}>
			<AppBar className={classes.appBar}>
				<Toolbar>
					<IconButton edge="start" color="inherit" onClick={() => onCancelled()} aria-label="close">
						<CloseIcon />
					</IconButton>
					<Typography variant="h6" className={classes.title}>{dialogTitle}</Typography>
					<Button autoFocus color="inherit" onClick={handleSave}>
						<FormattedMessage id="action.save" />
					</Button>
				</Toolbar>
			</AppBar>
			<DialogContent>
				<Grid container spacing={3}>
					<Grid item sm={8} xs={12}>
						<TextField autoFocus required fullWidth id="name" margin="normal"
							defaultValue={title}
							label={intl.formatMessage({ id : 'book.editor.fields.name.title' })}
							onChange={event => setTitle(event.target.value) }
						/>
						<TextField
							id="name"
							defaultValue={description}
							label={intl.formatMessage({ id : 'book.editor.fields.description.title' })}
							fullWidth
							multiline
							onChange={event => setDescription(event.target.value) }
						/>
						<AuthorDropDown fullWidth required id="author" margin="normal"
							label={intl.formatMessage({ id : 'book.editor.fields.author.title' })}
							defaultValue={ {id : authorId, name : authorName} }
							onChange={value => updateAuthorId(value) }
						/>
						<FormControlLabel control={<Checkbox id="public" margin="normal"
							defaultValue={isPublic}
							onChange={event => setPublic(event.target.checked)} />
						}
						label={intl.formatMessage({ id : 'book.editor.fields.public' })}
						labelPlacement="start"/>
						<CategoriesDropDown id="categories" fullWidth
							label={intl.formatMessage({ id : 'book.editor.fields.categories.title' })}
							value={categories}
							onChange={event => setCategories(event.target.value)}
						/>
						<TextField fullWidth id="publishYear" margin="normal" type="number"
							label={intl.formatMessage({ id : 'book.editor.fields.yearPublished.title' })}
							defaultValue={yearPublished}
							onChange={event => setYearPublish(event.target.value) }
						/>
						<FormControl fullWidth>
							<InputLabel>{intl.formatMessage({ id : 'book.editor.fields.language.title' })}</InputLabel>
							<LanguageDropDown fullWidth id="language"
								defaultValue={language}
								onChange={event => setLanguage(event.target.value)}
							/>
						</FormControl >
						<FormControl fullWidth>
							<InputLabel>{intl.formatMessage({ id : 'book.editor.fields.series.title' })}</InputLabel>
							<SeriesDropDown fullWidth id="series"
								defaultValue={seriesId}
								onChange={value => setSeriesId(value.id) }
							/>
						</FormControl>
						<TextField fullWidth id="publishYear" type="number" margin="normal"
							label={intl.formatMessage({ id : 'book.editor.fields.seriesIndex.title' })}
							defaultValue={seriesIndex}
							onChange={event => setSeriesIndex(event.target.value) }
						/>
						<FormControl fullWidth>
							<InputLabel>{intl.formatMessage({ id : 'book.editor.fields.copyrights.title' })}</InputLabel>
							<CopyrightDropDown fullWidth id="copyrights"
								defaultValue={copyrights}
								onChange={event => setCopyrights(event.target.value)}
							/>
						</FormControl>
					</Grid>
					{
						book && book.links.image_upload &&
						<Grid item sm={4} xs={12}>
							<DropzoneArea onChange={files => handleImageUpload(files)}
								filesLimit={1}
								acceptedFiles={['image/*']}
								dropzoneText={intl.formatMessage({ id: 'message.image.upload' })} />
						</Grid>
					}
				</Grid>
				{ error && <Alert severity="error" ><FormattedMessage id="books.messages.error.saving" /></Alert> }
			</DialogContent>
		</Dialog>
	);
};

export default BookEditor;
