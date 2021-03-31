import React, { useState, useEffect, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import { useSnackbar } from 'notistack';
import { FormattedMessage, useIntl } from "react-intl";

// mui
import Link from '@material-ui/core/Link';
import { makeStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import LayersIcon from '@material-ui/icons/Layers';
import Typography from "@material-ui/core/Typography";
import Divider from '@material-ui/core/Divider';
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import GridList from "@material-ui/core/GridList";
//mui icons
import CropOriginalIcon from '@material-ui/icons/CropOriginal';
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';
// 3rd party
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { useConfirm } from 'material-ui-confirm';
//component
import { libraryService } from "../../services";
import Page from './page';
import PageEditor from "./pageEditor";
import PageUploadButton from './pageUploadButton';
import PageDeleteButton from './pageDeleteButton';
import PageAssignButton from './pageAssignButton';
import PageFilterSideBar from './pageFilterSideBar';
import PageAssignmentFilterSideBar from './pageAssignmentFilterSideBar';
import PageGrid from './pageGrid';

// sidebar
import { Toolbar } from "@material-ui/core";
import BookPageProgress from "./bookPgeProgress";

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		maxWidth: 360,
		paddingTop: 20
	},
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
	grow: {
		flex: 1
	}
}));

const PagesList = ({ book }) => {
	if (book == null || book.links.pages == null) return null;
	const classes = useStyles();

	const location = useLocation();
	const history = useHistory();
	const confirm = useConfirm();
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();

	const [showPreview, setShowPreview] = useState(false);
	const [filter, setFilter] = useState(null);
	const [assignmentFilter, setAssignmentFilter] = useState('assignedToMe');
	const [isLoading, setLoading] = useState(true);
	const [isError, setError] = useState(false);
	const [showEditor, setShowEditor] = useState(false);
	const [selectedPage, setSelectedPage] = useState(null);
	const [checked, setChecked] = React.useState([]);

	const [pages, setPages] = useState({});

	const getQueryParams = () => {
		const values = queryString.parse(location.search);
		return { page: values.page, filter: values.filter, assignmentFilter: values.assignmentFilter };
	};

	// eslint-disable-next-line max-params
	const buildLinkToPage = (page, newFilter, newAssignmentFilter) => {
		let querystring = "";
		querystring += page ? `page=${page}&` : "";
		if (newFilter) {
			querystring += `filter=${newFilter}&`;
		}
		if (newAssignmentFilter) {
			querystring += `assignmentFilter=${newAssignmentFilter}&`;
		}

		if (querystring !== "") {
			querystring = `?${querystring}`.slice(0, -1);
		}

		return `${location.pathname}${querystring}`;
	};

	const loadData = () => {

		const params = getQueryParams();
		let filterToUse = params.filter;
		setAssignmentFilter(params.assignmentFilter);
		setFilter(filterToUse);

		setLoading(true);
		libraryService
			.getBookPages(book, filterToUse !== 'all' ? filterToUse : null, params.assignmentFilter !== 'all' ? params.assignmentFilter : null, params.page)
			.then((data) => {
				setPages(data);
				setChecked([]);
			})
			.catch(() => setError(true))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		const params = getQueryParams();
		if (params.filter == null) {
			const map = {
				'AvailableForTyping': 'available',
				'BeingTyped': 'available',
				'ReadyForProofRead': 'typed',
				'ProofRead': 'inReview',
				'Published': 'completed'
			}

			const params = getQueryParams();
			history.push(buildLinkToPage(params.page, map[book.status], params.assignmentFilter ? params.assignmentFilter : 'assignedToMe'));
		}
		else {
			loadData();
		}
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

	const handleFilterChange = (newFilter) => {

		const params = getQueryParams();
		history.push(buildLinkToPage(params.page, newFilter, params.assignmentFilter));
	}

	const handleAssignmentFilterChange = (newAssignmentFilter) => {
		const params = getQueryParams();
		history.push(buildLinkToPage(params.page, params.filter, newAssignmentFilter));
	}

	const renderEditLink = () => {
		if (book && book.links && book.links.update) {
			return (<Button onClick={() => setShowEditor(true)} startIcon={<EditOutlinedIcon />}>
				<FormattedMessage id="action.edit" />
			</Button>);
		}
		return null;
	};

	const renderChaptersLink = () => {
		if (book && book.links && book.links.update) {
			return (<Button component={Link} href={`/books/${book.id}/chapters`} startIcon={<LayersIcon />}>
				<FormattedMessage id="chapter.toolbar.chapters" />
			</Button>);
		}
		return null;
	}

	const renderSideBar = () => {
		return (
			<div className={classes.root}>
				<PageUploadButton onAdd={() => onEditClicked(null)} pages={pages} onFilesUploaded={loadData} />
				<PageDeleteButton checked={checked} pages={pages} onDeleted={loadData} />
				<PageAssignButton checked={checked} pages={pages} onAssigned={loadData} />
				<Divider />
				<PageFilterSideBar book={book} filter={filter} setFilter={(filter) => handleFilterChange(filter)} />
				<Divider />
				<PageAssignmentFilterSideBar assignmentFilter={assignmentFilter} onAssignmentFilterChanged={(af) => handleAssignmentFilterChange(af)} />
				<Divider />
				<BookPageProgress book={book} />
			</div>);
	}

	const renderToolbar = () => {
		if (!isLoading && pages) {
			return (
				<Toolbar >
					<Typography variant="h5">{book != null ? book.title : ''}</Typography>
					{renderEditLink()}
					{renderChaptersLink()}
					<div className={classes.grow} />
					<ToggleButtonGroup
						size="small"
						value={showPreview}
						exclusive
						onChange={(event, newValue) => setShowPreview(newValue)}
						aria-label="view"
					>
						<ToggleButton value={false} aria-label="list-view">
							<FormatAlignJustifyIcon fontSize="small" />
						</ToggleButton>
						<ToggleButton value={true} aria-label="preview">
							<CropOriginalIcon fontSize="small" />
						</ToggleButton>
					</ToggleButtonGroup>
				</Toolbar>
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
					<FormattedMessage id="pages.messages.error.loading" />
				</Typography>
			);
		}

		if (pages === null || pages.data === null || pages.data.length < 1) {
			return (
				<Typography variant="h6" component="h6" align="center">
					<FormattedMessage id="pages.messages.empty" />
				</Typography>
			);
		}

		if (showPreview) {
			return (
				<GridList cellHeight={280} className={classes.gridList} cols={4}>
					{pages.data.map((page) => (
						<Page page={page} key={page.sequenceNumber}
							onEdit={() => onEditClicked(page)}
							onChecked={checked.indexOf(page.sequenceNumber) !== -1}
							onClick={handleToggle(page.sequenceNumber)}
							onDeleted={() => loadData()}
						/>))}
				</GridList>
			);
		}

		return (<PageGrid pages={pages}
			onPageChange={p => history.push(buildLinkToPage(p, filter, assignmentFilter))}
			loading={isLoading} onSelectionChanged={selection => setChecked(selection)}
			onEdit={page => onEditClicked(page)}
			onDelete={page => onDeleteClicked(page)}
		/>);
	}

	return (
		<Grid container>
			<Grid sm={2} item>
				{renderSideBar()}
			</Grid>
			<Grid sm={10} item>
				{renderToolbar()}
				{renderPages()}
			</Grid>
			<PageEditor
				show={showEditor}
				page={selectedPage}
				createLink={pages && pages.links && pages.links.create}
				pageNumber={pages && pages.data && pages.data.length}
				onSaved={handleDataChanged}
				onCancelled={handleClose}
			/>
		</Grid>
	);
};

export default PagesList;
