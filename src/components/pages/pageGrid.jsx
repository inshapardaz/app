import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from 'react-router-dom';
import Typography from "@material-ui/core/Typography";
import Tooltip from '@material-ui/core/Tooltip';
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ImageIcon from '@material-ui/icons/Image';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import PageStatusIcon from '../../components/pages/pageStatusIcon';
import DescriptionIcon from '@material-ui/icons/Description';
import { DataGrid } from '@material-ui/data-grid';

const PageGrid = ({ pages, onPageChange, onSelectionChanged, onEdit, onDelete, loading }) => {
	const intl = useIntl();
	const columns = [
		{
			field: 'status',
			headerName: ' ',
			width: 40,
			sortable: false,
			disableClickEventBubbling: true,
			renderCell: (params) => (<PageStatusIcon status={params.value} />)
		},
		{
			field: 'sequenceNumber',
			headerName: intl.formatMessage({ id: 'page.editor.fields.sequenceNumber.title' }),
			flex: 1,
			disableClickEventBubbling: true,
			sortable: false,
			renderCell: (params) => (<Button component={Link} to={`/books/${params.row.bookId}/pages/${params.value}/editor`}>{params.value} </Button>)
		},
		{
			field: 'chapterTitle',
			headerName: intl.formatMessage({ id: 'page.editor.fields.chapter.title' }),
			flex: 1,
			disableClickEventBubbling: true,
			sortable: false,
			renderCell: (params) => params.value ? params.value : ''
		},
		{
			field: 'accountName',
			headerName: intl.formatMessage({ id: 'page.editor.fields.accountId.title' }),
			flex: 1,
			disableClickEventBubbling: true,
			sortable: false,
			renderCell: (params) => params.value ? params.value : (<Typography variant="caption">{intl.formatMessage({ id: 'page.available.label' })}</Typography>)
		},
		{
			field: 'bookId',
			headerName: ' ',
			width: 140,
			sortable: false,
			disableClickEventBubbling: true,
			renderCell: (params) => (
				<>
					<Tooltip title={<FormattedMessage id="action.editContent" />} >
						<IconButton component={Link} edge="end" aria-label="edit" to={`/books/${params.row.bookId}/pages/${params.row.sequenceNumber}/editor`}>
							<DescriptionIcon />
						</IconButton>
					</Tooltip>
					<Tooltip title={<FormattedMessage id="action.edit" />} >
						<IconButton edge="end" aria-label="edit" onClick={() => onEdit && onEdit(params.row)}>
							<EditIcon />
						</IconButton>
					</Tooltip>
					<Tooltip title={<FormattedMessage id="action.delete" />} >
						<IconButton edge="end" aria-label="delete" onClick={() => onDelete && onDelete(params.row)}>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				</>
			)
		}
	];

	const onImageClick = (page) => {
		console.log(page.links.image);
		PageImagePreview.show(page.links.image);
	}

	const handlePageChanged = (p) => {
		onPageChange && onPageChange(p.page + 1);
	};

	if (pages && pages.data) {
		return <DataGrid rows={pages.data} columns={columns} loading={loading} getRowId={row => row.sequenceNumber}
			pageSize={pages.pageSize} page={pages.currentPageIndex - 1} rowCount={pages.totalCount}
			paginationMode="server" onPageChange={handlePageChanged}
			rowsPerPageOptions={[10, 20, 30, 50, 75, 100]}
			checkboxSelection disableColumnMenu autoHeight
			onSelectionModelChange={(newSelection) => {
				if (onSelectionChanged) {
					onSelectionChanged(newSelection.selectionModel.map(m => parseInt(m)));
				}
			}} />;
	}
	return null;
}


export default PageGrid;
