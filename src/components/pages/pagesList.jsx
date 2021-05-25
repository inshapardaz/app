import React, { useState, useEffect, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import { useSnackbar } from 'notistack';
import { FormattedMessage, useIntl } from "react-intl";

// mui
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
//mui icons
import CropOriginalIcon from '@material-ui/icons/CropOriginal';
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';
// 3rd party
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { useConfirm } from 'material-ui-confirm';
import PageUploadButton from './pageUploadButton';
import PageDeleteButton from './pageDeleteButton';
import PageAssignButton from './pageAssignButton';
import Divider from '@material-ui/core/Divider';

//component
import { libraryService } from "../../services";
import PagesImageGrid from './PagesImageGrid';
import PageEditor from "./pageEditor";
import PageGrid from './pageGrid';

// sidebar
import { Toolbar } from "@material-ui/core";
import PagesSidebar from "./pagesSidebar";
import PageStatus from '../../models/pageStatus';
import BookStatus from '../../models/bookStatus';
import Loading from "../Loading";
import PagePagesAssignButton from "./pagePagesAssignButton";
import PageChapterAssignButton from "./pageChapterAssignButton";
import PageStatusUpdateButton from "./pageStatusUpdateButton";
import PageOcrButton from './pageOcrButton';

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

const getPreviewSetting = () => {
	const preview = localStorage.getItem('pages.list.preview');
	return preview !== null && preview === 'true';
}

const setPreviewSetting = (preview) => localStorage.setItem('pages.list.preview', preview);

const getSelectedPages = (pages, checked) => {
	if (pages && pages.data && checked.length > 0) {
		return pages.data.filter(p => checked.includes(p.sequenceNumber));
	}

	return [];
}

const PagesList = ({ book, onBookSaved }) => {
	if (book == null || book.links.pages == null) return null;
	const classes = useStyles();

	const location = useLocation();
	const history = useHistory();
	const confirm = useConfirm();
	const intl = useIntl();
	const { enqueueSnackbar } = useSnackbar();

	const [showPreview, setShowPreview] = useState(getPreviewSetting());
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

			let statusToShow = PageStatus.AvailableForTyping;

			switch (book.status) {
				case BookStatus.AvailableForTyping:
					statusToShow = PageStatus.AvailableForTyping;
					break;
				case BookStatus.BeingTyped:
					statusToShow = PageStatus.Typing;
					break;
				case BookStatus.ReadyForProofRead:
					statusToShow = PageStatus.Typed;
					break;
				case BookStatus.ProofRead:
					statusToShow = PageStatus.InReview;
					break;
				case BookStatus.Published:
					statusToShow = PageStatus.Completed;
			}

			const params = getQueryParams();
			history.push(buildLinkToPage(params.page, statusToShow, params.assignmentFilter ? params.assignmentFilter : 'assignedToMe'));
		}
		else {
			loadData();
		}
	}, [location]);

	const handleDataChanged = () => {
		handleClose();
		onBookSaved();
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

	const handleFilterChange = (newFilter) => {

		const params = getQueryParams();
		history.push(buildLinkToPage(1, newFilter, params.assignmentFilter));
	}

	const handleAssignmentFilterChange = (newAssignmentFilter) => {
		const params = getQueryParams();
		history.push(buildLinkToPage(1, params.filter, newAssignmentFilter));
	}

	const selectedPages = getSelectedPages(pages, checked);

	const renderToolbar = () => {
		if (!isLoading && pages) {
			return (
				<Toolbar >
					<PageUploadButton onAdd={() => onEditClicked(null)} pages={pages} onFilesUploaded={loadData} />
					<Divider />
					<PageDeleteButton selectedPages={selectedPages} onDeleted={loadData} />
					<PageAssignButton selectedPages={selectedPages} onAssigned={loadData} />
					<PagePagesAssignButton selectedPages={selectedPages} onAssigned={loadData} />
					<PageChapterAssignButton selectedPages={selectedPages} book={book} onUpdated={loadData} />
					<PageStatusUpdateButton selectedPages={selectedPages} onUpdated={loadData} />
					<PageOcrButton selectedPages={selectedPages} />
					<div className={classes.grow} />
					<ToggleButtonGroup
						size="small"
						value={showPreview}
						exclusive
						onChange={(event, newValue) => { setShowPreview(newValue); setPreviewSetting(newValue) }}
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
			return <Loading fullScreen={false} />;
		}

		if (isError) {
			return (
				<Typography variant="h6" component="h6" align="center">
					<FormattedMessage id="pages.messages.error.loading" />
				</Typography>
			);
		}

		if (showPreview) {
			return (<PagesImageGrid book={book} pages={pages}
				onSelectionChanged={checkedList => setChecked(checkedList)}
				checkedPages={checked}
				onEdit={(page) => onEditClicked(page)}
				onDeleted={() => loadData()}
				onPageChange={p => history.push(buildLinkToPage(p, filter, assignmentFilter))}
			/>);
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
				<PagesSidebar book={book} pages={pages} onUpdated={loadData}
					filter={filter} onStatusFilter={(filter) => handleFilterChange(filter)}
					assignmentFilter={assignmentFilter} onAssignmentFilterChanged={(af) => handleAssignmentFilterChange(af)}
				/>
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
