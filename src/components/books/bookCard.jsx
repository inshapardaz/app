import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import LayersIcon from '@material-ui/icons/Layers';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';

import Tooltip from '@material-ui/core/Tooltip';
import { FormattedMessage, useIntl } from 'react-intl';
import { libraryService } from '../../services';
import { LinearProgress } from '@material-ui/core';

const defaultBookImage = '/images/book_placeholder.jpg';

const useStyles = makeStyles((theme) => ({
	progress: {
		cursor: 'pointer'
	},
	popoverRoot: {
		minWidth: 200
	},
	progressBar: {
		marginTop: '2px',
		marginBottom: '2px',
	}
}));

const FavoriteButton = ({ book, onUpdated, onOpen }) => {
	const changeFavorite = () => {
		try {
			if (book && book.links && book.links.create_favorite) {
				libraryService.post(book.links.create_favorite, {});
			}
			else if (book && book.links && book.links.remove_favorite) {
				libraryService.delete(book.links.remove_favorite, {});
			}

			onUpdated();
		}
		catch (e) {
			console.dir(e);
		}
	};

	if (book && book.links && book.links.create_favorite) {
		return (<Tooltip title={<FormattedMessage id="books.action.favorite.add" />} >
			<IconButton aria-label="add to favorites" onClick={() => changeFavorite()}>
				<FavoriteBorderIcon />
			</IconButton>
		</Tooltip>);
	}
	else if (book && book.links && book.links.remove_favorite) {

		return (<Tooltip title={<FormattedMessage id="books.action.favorite.remove" />} >
			<IconButton aria-label="remove from favorites" onClick={() => changeFavorite()}>
				<FavoriteIcon />
			</IconButton>
		</Tooltip>);
	}

	return null;
}

const BookProgress = ({ book }) => {
	const classes = useStyles();
	const intl = useIntl();
	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const popOver = () => {
		if (book.pageStatus) {
			return (
				<Box p={2} className={classes.popoverRoot}>
					{
						book.pageStatus.map(s => (
							<div key={s.status}>
								<Typography variant="caption" display="block" gutterBottom><FormattedMessage id={`status.${s.status}`} /></Typography>
								<LinearProgress value={s.percentage} variant="determinate" className={classes.progressBar} color={s.status === 'Completed' ? 'primary' : 'secondary'} />
							</div>
						))
					}
				</Box>);
		}

		return (<Box p={2} className={classes.popoverRoot}><Typography component="span"><FormattedMessage id="pages.progress.none" /></Typography></Box >);
	}

	const open = Boolean(anchorEl);

	if (book.status === 'Published') return null;

	return (<CardActions>
		<Typography variant="body2" color="textSecondary" component="span" onClick={handleClick} className={classes.progress}>
			{book.pageCount > 0
				? <>
					<FormattedMessage id="pages.progress" values={{
						completed: intl.formatNumber(book.progress, {
							style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 0
						}), count: book.pageCount
					}} />
					<LinearProgress value={book.progress} variant="determinate" />
				</>
				: <FormattedMessage id="pages.progress.none" />
			}
		</Typography>
		<Popover
			id={book.id}
			open={open}
			anchorEl={anchorEl}
			onClose={handleClose}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'left',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'center',
			}}
		>
			{popOver()}
		</Popover>
	</CardActions>);
};

const BookCell = ({ book, onOpen, onEdit, onDelete, onUpdated, showProgress = false }) => {
	const intl = useIntl();
	const classes = makeStyles(() => ({
		root: {
			maxWidth: 345
		},
		cardProgress: {
			paddingTop: '2px',
			paddingBottom: '2px',
		}
	}));

	const renderEditLink = () => {
		if (book && book.links && book.links.update) {
			return (<Tooltip title={<FormattedMessage id="action.edit" />} >
				<IconButton onClick={() => onEdit(book)}>
					<EditOutlinedIcon />
				</IconButton>
			</Tooltip>);
		}
		return null;
	};

	const renderChaptersLink = () => {
		if (book && book.links && book.links.update) {
			return (<Tooltip title={<FormattedMessage id="chapter.toolbar.chapters" />} >
				<IconButton component={Link} to={`/books/${book.id}/chapters`}>
					<LayersIcon />
				</IconButton>
			</Tooltip>);
		}
		return null;
	}

	const renderPagesLink = () => {
		if (book && book.links && book.links.update) {
			return (<Tooltip title={<FormattedMessage id="pages.label" />} >
				<IconButton component={Link} to={`/books/${book.id}/pages`}>
					<FileCopyIcon />
				</IconButton>
			</Tooltip>);
		}
		return null;
	}

	const renderDeleteLink = () => {
		if (book && book.links && book.links.delete) {
			return (<Tooltip title={<FormattedMessage id="action.delete" />} >
				<IconButton onClick={() => onDelete(book)}>
					<DeleteForeverOutlinedIcon />
				</IconButton>
			</Tooltip>);
		}
		return null;
	};

	const setDefaultBookImage = (ev) => {
		ev.target.src = defaultBookImage;
	};

	const renderBookStatus = () => {
		const statuses = [{
			key: 'Published',
			name: intl.formatMessage({ id: 'book.status.Published' })
		}, {
			key: 'AvailableForTyping',
			name: intl.formatMessage({ id: 'book.status.AvailableForTyping' })
		}, {
			key: 'BeingTyped',
			name: intl.formatMessage({ id: 'book.status.BeingTyped' })
		}, {
			key: 'ReadyForProofRead',
			name: intl.formatMessage({ id: 'book.status.ReadyForProofRead' })
		}, {
			key: 'ProofRead',
			name: intl.formatMessage({ id: 'book.status.ProofRead' })
		}];

		if (!showProgress) return null;

		return (
			<CardActions>
				<Typography variant="body2" color="textSecondary" component="span">
					{statuses.find(x => x.key === book.status).name}
				</Typography>
			</CardActions>);
	}

	return (
		<Card className={classes.root}>
			<CardActionArea>
				<CardMedia
					component="img"
					alt={book.title}
					height="360"
					image={(book.links ? book.links.image : null) || defaultBookImage}
					title={book.title}
					onError={setDefaultBookImage}
					onClick={() => onOpen(book)}
				/>
				<CardContent>
					<Tooltip title={book.title} aria-label={book.title}>
						<Typography gutterBottom variant="h5" component="h2" noWrap onClick={() => onOpen(book)}>
							{book.title}
						</Typography>
					</Tooltip>
					<Typography variant="body2" color="textSecondary" component="p">
						{book.authorName}
					</Typography>
				</CardContent>
			</CardActionArea>
			{renderBookStatus()}
			{ showProgress && <BookProgress book={book} />}
			<CardActions>
				{renderEditLink()}
				{renderDeleteLink()}
				{renderChaptersLink()}
				{renderPagesLink()}
				<Tooltip title={<FormattedMessage id="action.read" />} >
					<IconButton component={Link} to={`/books/${book.id}`}>
						<MenuBookIcon />
					</IconButton>
				</Tooltip>
				<FavoriteButton book={book} onUpdated={() => onUpdated()} />
			</CardActions>
		</Card>
	);
}

export default BookCell;
