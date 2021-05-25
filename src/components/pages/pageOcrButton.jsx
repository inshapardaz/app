import React, { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import { blue } from '@material-ui/core/colors';
import { FormattedMessage, useIntl } from "react-intl";
import { libraryService } from "../../services";
import { TextField, Typography } from '@material-ui/core';
import ScheduleIcon from '@material-ui/icons/Schedule';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { green, red, } from '@material-ui/core/colors';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import EditorDialog from '../editorDialog';


const useStyles = makeStyles({
	avatar: {
		backgroundColor: blue[100],
		color: blue[600],
	},
});

const getOcrStatusIcon = (status) => {
	if (status === 'pending') {
		return (<ScheduleIcon />);
	}
	else if (status === 'inProgress') {
		return (<HourglassEmptyIcon />);
	}
	else if (status === 'complete') {
		return (<CheckCircleOutlineIcon style={{ color: green[500] }} />);
	}
	else if (status === 'error') {
		return (<ErrorOutlineIcon style={{ color: red[500] }} />);
	}
}

const OcrGrid = ({ pages }) => {
	return (
		<TableContainer>
			<Table >
				<TableBody>
					{pages.map((page) => (
						<TableRow key={page.sequenceNumber}>
							<TableCell component="th" scope="row">
								{page.sequenceNumber}
							</TableCell>
							<TableCell align="right">{getOcrStatusIcon(page.ocrStatus)}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

function SimpleDialog(props) {
	const intl = useIntl();
	const [key, setKey] = useState('');
	const [busy, setBusy] = useState(false);
	const [pagesStatus, setPagesStatus] = useState([]);

	const { onClose, open, selectedPages } = props;

	useEffect(() => {
		if (selectedPages) {
			setPagesStatus(selectedPages.map(p => ({ sequenceNumber: p.sequenceNumber, ocrStatus: 'pending' })))
		}
	}, [selectedPages]);

	const handleClose = () => {
		onClose();
	};

	const setPageStatus = (page, status) => {
		var newPages = pagesStatus.map(p => {
			if (p.sequenceNumber === page.sequenceNumber) {
				p.ocrStatus = status;
			}

			return p;
		});

		setPagesStatus(newPages);
	}

	const handleSubmit = () => {
		var promises = [];
		setBusy(true);
		selectedPages.map(page => {
			if (page !== null && page !== undefined && page.ocrStatus !== 'completed') {
				if (page.links.ocr) {
					setPageStatus(page, 'processing')
					return promises.push(libraryService.post(page.links.ocr, key)
						.then(() => setPageStatus(page, 'complete'))
						.catch(() => setPageStatus(page, 'error')));
				}
			}
			else {
				setPageStatus(page, 'skipped')
			}

			return Promise.resolve();
		});

		Promise.all(promises)
			.then(() => setBusy(false))
			.catch(e => console.error(e));
	};

	const hasProcessablePages = pagesStatus.filter(x => x.ocrStatus === 'error' || x.ocrStatus === 'pending').length > 0;

	return (
		<EditorDialog show={open} busy={busy}
			title={<FormattedMessage id="pages.ocr" />}
			onCancelled={handleClose}  >
			<Typography>
				<FormattedMessage id="pages.ocr.description" />
			</Typography>
			<TextField
				autoFocus
				margin="dense"
				id="key"
				value={key}
				onChange={(event) => setKey(event.target.value)}
				label={intl.formatMessage({ id: 'pages.ocr.title' })}
				fullWidth
			/>
			<OcrGrid pages={pagesStatus} />
			<Button aria-controls="get-text" aria-haspopup="false" onClick={handleSubmit}
				disabled={!key || !hasProcessablePages}
				startIcon={<FindInPageIcon />} fullWidth
				variant="contained"
				color="primary">
				<FormattedMessage id="pages.ocr" />
			</Button>
		</EditorDialog >
	);
}

SimpleDialog.propTypes = {
	onClose: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
};

const PageOcrButton = ({ selectedPages }) => {
	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Button disabled={selectedPages.length < 1} onClick={handleClickOpen} startIcon={<FindInPageIcon />}>
				<FormattedMessage id="pages.ocr" />
			</Button>
			<SimpleDialog open={open} onClose={handleClose} selectedPages={selectedPages} />
		</>
	);
};

export default PageOcrButton;
