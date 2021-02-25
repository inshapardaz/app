import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import queryString from "query-string";
import { useSnackbar } from 'notistack';
import { FormattedMessage, useIntl } from "react-intl";

// mui
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import Box from "@material-ui/core/Box";;
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import List from '@material-ui/core/List';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from "@material-ui/core/CircularProgress";
import MenuItem from '@material-ui/core/MenuItem';
import GridList from "@material-ui/core/GridList";
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Pagination from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem"
//mui icons
import EditIcon from '@material-ui/icons/Edit';
import PostAddIcon from '@material-ui/icons/PostAdd';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import PersonIcon from '@material-ui/icons/Person';
import DeleteIcon from '@material-ui/icons/Delete';
import CropOriginalIcon from '@material-ui/icons/CropOriginal';
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DescriptionIcon from '@material-ui/icons/Description';
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
// 3rd party
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { DropzoneDialog } from 'material-ui-dropzone'
import { useConfirm } from 'material-ui-confirm';
//component
import { libraryService } from "../../services";
import PageEditor from "./pageEditor";
import PageListItem from './pageListItem';
import DropDownMenu from "../dropdownMenu";
import PageStatusIcon from '../../components/pages/pageStatusIcon';
import { Divider } from "@material-ui/core";

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

// eslint-disable-next-line max-params
const buildLinkToPage = (page, filter, assignmentFilter) => {
	const location = useLocation();

	let querystring = "";
	querystring += page ? `page=${page}&` : "";
	if (filter && filter !== 'none') {
		querystring += `filter=${filter}&`;
	}
	if (assignmentFilter && assignmentFilter !== 'all') {
		querystring += `assignmentFilter=${assignmentFilter}&`;
	}

	if (querystring !== "") {
		querystring = `?${querystring}`.slice(0, -1);
	}

	return `${location.pathname}${querystring}`;
};

const PagesList = ({ book }) => {
	if (book == null || book.links.pages == null) return null;
	const location = useLocation();
	const confirm = useConfirm();
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();

	const [showPreview, setShowPreview] = useState(false);
	const [filter, setFilter] = useState('none');
	const [assignmentFilter, setAssignmentFilter] = useState('all');
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
				});

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

	const onAssignToMe = () => {
		var promises = [];

		checked.map(id => {
			var p = pages.data.find(p => p.sequenceNumber === id);
			if (p !== null && p !== undefined) {
				if (p.links.assign_to_me) {
					return promises.push(libraryService.post(p.links.assign_to_me));
				}
			}

			return Promise.resolve();
		});

		Promise.all(promises)
			.then(() => enqueueSnackbar(intl.formatMessage({ id: 'page.messages.deleted' }), { variant: 'success' }))
			.then(() => loadData())
			.catch(() => enqueueSnackbar(intl.formatMessage({ id: 'page.messages.error.delete' }), { variant: 'error' }));
	};

	const renderToolBar = () => {
		if (pages && pages.links && pages.links.create) {
			return (
				<Toolbar>
					<DropDownMenu title={<FormattedMessage id="page.action.create" />} >
						<MenuItem
							edge="start"
							className={classes.menuButton}
							color="inherit"
							aria-label="menu"
							onClick={() => onEditClicked(null)}>
							<ListItemIcon>
								<AddCircleIcon fontSize="small" />
							</ListItemIcon>
							<Typography variant="inherit"><FormattedMessage id="page.action.create" /></Typography>
						</MenuItem>
						<MenuItem
							edge="start"
							className={classes.menuButton}
							color="inherit"
							aria-label="menu"
							onClick={() => setShowFilesUpload(true)}>
							<ListItemIcon>
								<PostAddIcon fontSize="small" />
							</ListItemIcon>
							<Typography variant="inherit"><FormattedMessage id="page.action.upload" /></Typography>
						</MenuItem>
						<MenuItem
							edge="start"
							className={classes.menuButton}
							color="inherit"
							aria-label="menu"
							onClick={() => setShowZipUpload(true)}>
							<ListItemIcon>
								<CloudUploadIcon fontSize="small" />
							</ListItemIcon>
							<Typography variant="inherit"><FormattedMessage id="page.action.uploadZip" /></Typography>
						</MenuItem>
					</DropDownMenu>
					<Button
						edge="start"
						className={classes.menuButton}
						color="inherit"
						disabled={checked.length <= 0}
						aria-label="menu"
						variant="text"
						onClick={onDeleteMultipleClicked}
						startIcon={<DeleteIcon />}>
						<FormattedMessage id="action.delete" />
					</Button>
					<Button
						edge="start"
						className={classes.menuButton}
						color="inherit"
						disabled={checked.length <= 0}
						aria-label="menu"
						variant="text"
						onClick={onAssignToMe}
						startIcon={<AssignmentIndIcon />}>
						<FormattedMessage id="page.assignedToMe.label" />
					</Button>
				</Toolbar >
			);
		}

		return null;
	};

	const renderViewToolBar = () => {
		return (<Toolbar>
			<ToggleButtonGroup
				value={showPreview}
				exclusive
				onChange={(event, newValue) => setShowPreview(newValue)}
				aria-label="view"
			>
				<ToggleButton variant="text" value={false} aria-label="list-view">
					<FormatAlignJustifyIcon />
				</ToggleButton>
				<ToggleButton variant="text" value={true} aria-label="preview">
					<CropOriginalIcon />
				</ToggleButton>
			</ToggleButtonGroup>
			<Divider orientation="vertical" />
			<ToggleButtonGroup exclusive aria-label="assignment-filter"
				value={filter}
				onChange={(event, newValue) => setFilter(newValue)}>
				<ToggleButton variant="text" value='none' aria-label="all-pages">
					<PageStatusIcon status={-1} />
				</ToggleButton>
				<ToggleButton variant="text" value='available' aria-label="available">
					<PageStatusIcon status={0} />
				</ToggleButton>
				<ToggleButton variant="text" value='typing' aria-label="typing">
					<PageStatusIcon status={1} />
				</ToggleButton>
				<ToggleButton variant="text" value='typed' aria-label="typed">
					<PageStatusIcon status={2} />
				</ToggleButton>
				<ToggleButton variant="text" value='proofread' aria-label="proof-read">
					<PageStatusIcon status={3} />
				</ToggleButton>
				<ToggleButton variant="text" value='completed' aria-label="completed">
					<PageStatusIcon status={4} />
				</ToggleButton>
			</ToggleButtonGroup>
			<Divider orientation="vertical" />
			<ToggleButtonGroup exclusive aria-label="assignment-type"
				value={assignmentFilter}
				onChange={(event, newValue) => setAssignmentFilter(newValue)}>
				<ToggleButton variant="text" value='all' aria-label="all-pages">
					<DescriptionIcon />
				</ToggleButton>
				<ToggleButton variant="text" value='unassigned' aria-label="unassigned-pages">
					<CheckBoxOutlineBlankIcon />
				</ToggleButton>
				<ToggleButton variant="text" value='assigned' aria-label="assigned">
					<PeopleAltIcon />
				</ToggleButton>
				<ToggleButton variant="text" value='mine' aria-label="assigned-to-me">
					<PersonIcon />
				</ToggleButton>
			</ToggleButtonGroup>
		</Toolbar>);
	}

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

		if (showPreview) {
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
											<DescriptionIcon style={{ color: "white" }} />
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

		return (<List >
			{pages.data.map(p => (<PageListItem page={p} key={p.sequenceNumber}
				checked={checked.indexOf(p.sequenceNumber) !== -1}
				onCheckChanged={handleToggle(p.sequenceNumber)}
				onEdit={() => onEditClicked(p)}
				onDelete={() => onDeleteClicked(p)}
			/>))
			}
		</List >);
	}

	return (
		<Container className={classes.cardGrid} maxWidth="md">
			{renderToolBar()}
			{renderViewToolBar()}
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
				filesLimit={50}
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
				maxFileSize={5000000}
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
