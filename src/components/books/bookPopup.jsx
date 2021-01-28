import React from "react";
import { ButtonBase, Grid, Typography, Chip } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import EditorDialog from '../editorDialog';
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import ChapterList from '../chapters/chapterList';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	paper: {
		padding: theme.spacing(2),
		margin: 'auto',
		maxWidth: 500,
	},
	image: {
		width: 230,
		height: 260,
	},
	img: {
		margin: 'auto',
		display: 'block',
		maxWidth: '100%',
		maxHeight: '100%',
	},
}));

const BookPopup = ({ show, book, onClosed }) => {
	const classes = useStyles();

	if (book == null) return null;

	return (
		<EditorDialog show={show} title={book.title} onCancelled={onClosed}  >
			<Grid container spacing={2}>
				{book.links && book.links.image && <Grid item>
					<ButtonBase className={classes.image}>
						<img className={classes.img} alt="complex" src={book.links.image} />
					</ButtonBase>
				</Grid>}
				<Grid item xs={12} sm container>
					<Grid item xs container direction="column" spacing={2}>
						<Grid item xs>
							<Typography variant="h3" component="h3" gutterBottom>
								{book.title}
							</Typography>
							<Typography variant="h6" component="h6" gutterBottom>
								<FormattedMessage id="book.by" /> <Link to={`/authors/${book.authorId}`}>{book.authorName}</Link>
							</Typography>
							<Typography variant="body2" color="textSecondary">
								{book.description}
							</Typography>
						</Grid>
						{book.seriesId && <Grid item>
							<Typography variant="body2">
								<FormattedMessage id="book.series" values={{ name: (<Link to={`/series/${book.seriesId}`} > { book.seriesName}</Link>), index: book.seriesIndex }} />
							</Typography>
						</Grid>}
						<Grid item>
							<Typography variant="body2" >
								<FormattedMessage id="book.publish" values={{ year: book.yearPublished }} />
							</Typography>
						</Grid>
						<Grid item>
							<Typography variant="body2" >
								<FormattedMessage id={`copyrights.${book.copyrights}`} />
							</Typography>
						</Grid>
						{book.categories && book.categories.length > 0 && <Grid item>
							{book.categories.map(c => (<Chip key={c.id} component="a" href={`/books?category=${c.id}`} clickable variant="outlined" label={c.name} />))}
						</Grid>}
						<Typography variant="h4"><FormattedMessage id="chapter.toolbar.chapters" /></Typography>
						<ChapterList book={book} allowEdit={false} />
					</Grid>
				</Grid>
			</Grid>
		</EditorDialog >
	);
};

export default BookPopup;
