import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import queryString from "query-string";
import { useSnackbar } from 'notistack';
import { FormattedMessage, useIntl } from "react-intl";
import { useConfirm } from 'material-ui-confirm';

import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Pagination from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Typography from "@material-ui/core/Typography";
import Tooltip from '@material-ui/core/Tooltip';
import List from '@material-ui/core/List';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from "@material-ui/core/CircularProgress";
import EditIcon from '@material-ui/icons/Edit';
import PostAddIcon from '@material-ui/icons/PostAdd';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';
import { DropzoneDialog } from 'material-ui-dropzone'

import { libraryService } from "../../services";
import PageEditor from "./pageEditor";
import GridList from "@material-ui/core/GridList";
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import PageListItem from './pageListItem';
const useStyles = () =>
	makeStyles((theme) => ({
		cardGrid: {
			paddingTop: theme.spacing(8),
			paddingBottom: theme.spacing(8),
		},
		gridList: {
			width: 500,
			height: 450,
		},
		icon: {
			color: 'rgba(255, 255, 255, 0.54)',
		},
	}));
const classes = useStyles();

const PagesList = ({ book }) => {
	if (book == null || book.links.pages == null) return null;
	const location = useLocation();
	const confirm = useConfirm();
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();

	const [isLoading, setLoading] = useState(true);
	const [isError, setError] = useState(false);
	const [showEditor, setShowEditor] = useState(false);
	const [selectedPage, setSelectedPage] = useState(null);
	const [showFilesUpload, setShowFilesUpload] = useState(false);
	const [showZipUpload, setShowZipUpload] = useState(false);
	const [checked, setChecked] = React.useState([]);

	const [pages, setPages] = useState({});

	const loadData = () => {
		const values = queryString.parse(location.search);
		const page = values.page;
		setLoading(true);
		libraryService
			.getBookPages(book, page)
			.then((data) => {
				setPages(data);
				setChecked([]);
			})
			.catch(() => setError(true))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		loadData();
	}, [location]);

	const handleDataChanged = () => {
		handleClose();
		loadData();
	};

	const handleClose = () => {
		setSelectedPage(null);
		setShowEditor(false);
	};

	const onEditClicked = useCallback(
		(page) => {
			setSelectedPage(page);
			setShowEditor(true);
		},
		[pages]
	);

	const onDeleteClicked = useCallback(
		(page) => {
			confirm({
				title: intl.formatMessage({ id: "action.delete" }),
				description: intl.formatMessage({ id: "page.action.confirmDelete" }, { sequenceNumber: page.sequenceNumber }),
				confirmationText: intl.formatMessage({ id: "action.yes" }),
				cancellationText: intl.formatMessage({ id: "action.no" }),
				confirmationButtonProps: { variant: "contained", color: "secondary" },
				cancellationButtonProps: { color: "secondary" }
			})
				.then(() => {
					return libraryService.delete(page.links.delete)
						.then(() => enqueueSnackbar(intl.formatMessage({ id: 'page.messages.deleted' }), { variant: 'success' }))
						.then(() => loadData())
						.catch(() => enqueueSnackbar(intl.formatMessage({ id: 'page.messages.error.delete' }), { variant: 'error' }));
				}).catch(() => { })

		},
		[pages]
	);

	const onDeleteMultipleClicked = useCallback(() => {
		confirm({
			title: intl.formatMessage({ id: "action.delete" }),
			description: intl.formatMessage({ id: "page.action.confirmDeleteMultiple" }, { count: checked.length }),
			confirmationText: intl.formatMessage({ id: "action.yes" }),
			cancellationText: intl.formatMessage({ id: "action.no" }),
			confirmationButtonProps: { variant: "contained", color: "secondary" },
			cancellationButtonProps: { color: "secondary" }
		})
			.then(() => {
				var promises = [];

				checked.map(id => {
					var page = pages.data.find(p => p.sequenceNumber === id);
					if (page && page.links && page.links.delete) {
						return promises.push(libraryService.delete(page.links.delete));
					}
					else {
						return Promise.resolve();
					}
				})

				Promise.all(promises)
					.then(() => enqueueSnackbar(intl.formatMessage({ id: 'page.messages.deleted' }), { variant: 'success' }))
					.then(() => loadData())
					.catch(() => enqueueSnackbar(intl.formatMessage({ id: 'page.messages.error.delete' }), { variant: 'error' }));
			}).catch(() => { })
	}, [pages, checked]);

	const handleToggle = (value) => () => {
		const currentIndex = checked.indexOf(value);
		const newChecked = [...checked];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		setChecked(newChecked);
	};

	const handleFileUpload = useCallback(
		(files) => {
			if (files.length < 1) {
				return;
			}

			setLoading(true);
			if (pages && pages.links.create_multiple !== null) {
				libraryService.postMultipleFile(pages.links.create_multiple, files)
					.then(() => {
						enqueueSnackbar(intl.formatMessage({ id: 'pages.messages.saved' }), { variant: 'success' })
						setShowFilesUpload(false);
						loadData();
					})
					.catch(() => {
						enqueueSnackbar(intl.formatMessage({ id: 'pages.messages.error.saving' }), { variant: 'error' })
					})
					.finally(() => setLoading(false));
			}
		}, [pages]
	);

	const handleZipFileUpload = useCallback(
		(files) => {
			if (files.length < 1) {
				return;
			}

			setLoading(true);
			if (pages && pages.links.bulk_upload !== null) {
				libraryService.postFile(pages.links.bulk_upload, files[0])
					.then(() => {
						enqueueSnackbar(intl.formatMessage({ id: 'pages.messages.saved' }), { variant: 'success' })
						setShowZipUpload(false);
						loadData();
					})
					.catch(() => {
						enqueueSnackbar(intl.formatMessage({ id: 'pages.messages.error.saving' }), { variant: 'error' })
					})
					.finally(() => setLoading(false));
			}
		}, [pages]
	);

	const renderToolBar = () => {
		if (pages && pages.links && pages.links.create) {
			return (
				<Toolbar>
					<Tooltip title={<FormattedMessage id="page.action.create" />} >
						<Button
							edge="start"
							className={classes.menuButton}
							color="inherit"
							aria-label="menu"
							onClick={() => onEditClicked(null)}
							startIcon={<AddCircleIcon />}>
							<FormattedMessage id="page.action.create" />
						</Button>
					</Tooltip>
					<Tooltip title={<FormattedMessage id="page.action.upload" />} >
						<Button
							edge="start"
							className={classes.menuButton}
							color="inherit"
							aria-label="menu"
							onClick={() => setShowFilesUpload(true)}
							startIcon={<PostAddIcon />}>
							<FormattedMessage id="page.action.upload" />
						</Button>
					</Tooltip>
					<Tooltip title={<FormattedMessage id="page.action.uploadZip" />} >
						<Button
							edge="start"
							className={classes.menuButton}
							color="inherit"
							aria-label="menu"
							onClick={() => setShowZipUpload(true)}
							startIcon={<CloudUploadIcon />}>
							<FormattedMessage id="page.action.uploadZip" />
						</Button>
					</Tooltip >
					<Button
						edge="start"
						className={classes.menuButton}
						color="inherit"
						disabled={checked.length <= 0}
						aria-label="menu"
						onClick={onDeleteMultipleClicked}
						startIcon={<DeleteIcon />}>
						<FormattedMessage id="action.delete" />
					</Button>
				</Toolbar >
			);
		}

		return null;
	};

	const renderPagination = () => {
		if (!isLoading && pages) {
			return (
				<Box mt={8} mb={8}>
					<Pagination
						page={pages.currentPageIndex}
						count={pages.pageCount}
						variant="outlined"
						shape="rounded"
						renderItem={(item) => (
							<PaginationItem
								component={Link}
								to={`${location.pathname}?page=${item.page}`}
								{...item}
							/>
						)}
					/>
				</Box>
			);
		}

		return null;
	};

	const renderPages = () => {
		if (isLoading) {
			return <CircularProgress />;
		}

		if (isError) {
			return (
				<Typography variant="h6" component="h6" align="center">
					<FormattedMessage id="chapters.messages.error.loading" />
				</Typography>
			);
		}

		if (pages === null || pages.data === null || pages.data.length < 1) {
			return (
				<Typography variant="h6" component="h6" align="center">
					<FormattedMessage id="chapters.messages.empty" />
				</Typography>
			);
		}

		return (<List >
			{pages.data.map(p => (<PageListItem page={p} key={p.sequenceNumber}
				checked={checked.indexOf(p.sequenceNumber) !== -1}
				onCheckChanged={handleToggle(p.sequenceNumber)}
				onEdit={() => onEditClicked(p)}
				onDelete={() => onDeleteClicked(p)}
			/>))
			}
		</List >);

		return (
			<GridList cellHeight={280} className={classes.gridList} cols={3}>
				{pages.data.map((page) => (
					<GridListTile key={page.sequenceNumber}>
						<img src={page.links.image != null ? page.links.image : "/images/no_image.png"} alt={page.sequenceNumber} />
						<GridListTileBar
							title={page.sequenceNumber}
							subtitle={page.accountId && (<FormattedMessage id="page.assignedTo.label" values={{ name: page.accountName }} />)}
							actionIcon={
								<>
									<IconButton edge="end" aria-label="edit" onClick={() => onEditClicked(page)}>
										<EditIcon style={{ color: "white" }} />
									</IconButton>
									<IconButton edge="end" aria-label="delete" onClick={() => onDeleteClicked(page)}>
										<DeleteIcon style={{ color: "white" }} />
									</IconButton>
									<Checkbox
										edge="start"
										checked={checked.indexOf(page.sequenceNumber) !== -1}
										onClick={handleToggle(page.sequenceNumber)}
										tabIndex={-1}
										disableRipple
									/>
								</>
							}
						/>
					</GridListTile>
				))}
			</GridList>
		);


	}

	return (
		<Container className={classes.cardGrid} maxWidth="md">
			{renderToolBar()}
			{renderPages()}
			{renderPagination()}
			<PageEditor
				show={showEditor}
				page={selectedPage}
				createLink={pages && pages.links && pages.links.create}
				pageNumber={pages && pages.data && pages.data.length}
				onSaved={handleDataChanged}
				onCancelled={handleClose}
			/>
			<DropzoneDialog
				open={showFilesUpload}
				onSave={handleFileUpload}
				acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
				showPreviews={true}
				maxFileSize={5000000}
				filesLimit={10}
				fullWidth={true}
				showAlerts={false}
				onClose={() => setShowFilesUpload(false)}
				dialogTitle={intl.formatMessage({ id: "page.action.upload" })}
				dropzoneText={intl.formatMessage({ id: "page.action.upload.help" })}
				cancelButtonText={intl.formatMessage({ id: "action.cancel" })}
				submitButtonText={intl.formatMessage({ id: "action.upload" })}
			/>
			<DropzoneDialog
				open={showZipUpload}
				onSave={handleZipFileUpload}
				acceptedFiles={['application/zip', 'application/x-zip-compressed']}
				filesLimit={1}
				showPreviews={false}
				onClose={() => setShowZipUpload(false)}
				dialogTitle={intl.formatMessage({ id: "page.action.uploadZip" })}
				dropzoneText={intl.formatMessage({ id: "page.action.uploadZip.help" })}
				cancelButtonText={intl.formatMessage({ id: "action.cancel" })}
				submitButtonText={intl.formatMessage({ id: "action.upload" })}
				onDropRejected={(rejectedFiles) => console.dir(rejectedFiles)}
			/>
		</Container>
	);
};

export default PagesList;
