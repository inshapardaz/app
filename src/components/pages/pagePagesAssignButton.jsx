import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ScheduleIcon from '@material-ui/icons/Schedule';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import { green, red, } from '@material-ui/core/colors';
import { FormattedMessage, useIntl } from "react-intl";
import WritersDropDown from '../account/writersDropdown';
import EditorDialog from '../editorDialog';
import { libraryService } from "../../services";

const getStatusIcon = (status) => {
	if (status === 'pending') {
		return (<ScheduleIcon />);
	}
	else if (status === 'processing') {
		return (<HourglassEmptyIcon />);
	}
	else if (status === 'complete') {
		return (<CheckCircleOutlineIcon style={{ color: green[500] }} />);
	}
	else if (status === 'error') {
		return (<ErrorOutlineIcon style={{ color: red[500] }} />);
	}
}

const AssignList = ({ pages }) => {
	return (
		<TableContainer>
			<Table >
				<TableBody>
					{pages.map((page) => (
						<TableRow key={page.sequenceNumber}>
							<TableCell component="th" scope="row">
								{page.sequenceNumber}
							</TableCell>
							<TableCell align="right">{getStatusIcon(page.assignStatus)}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

function SimpleDialog({ onClose, open, selectedPages, onAssigned }) {
	const intl = useIntl();
	const [busy, setBusy] = useState(false);
	const [selectedAccount, setSelectedAccount] = useState(null);
	const [pagesStatus, setPagesStatus] = useState([]);

	useEffect(() => {
		if (selectedPages) {
			setPagesStatus(selectedPages.map(p => ({ sequenceNumber: p.sequenceNumber, assignStatus: 'pending' })))
		}
	}, [selectedPages]);

	const handleClose = (success = false) => {
		if (success && onAssigned) {
			onAssigned();
		}
		onClose();
	};

	const setPageStatus = (page, status) => {
		var newPages = pagesStatus.map(p => {
			if (p.sequenceNumber === page.sequenceNumber) {
				p.assignStatus = status;
			}

			return p;
		});

		setPagesStatus(newPages);
	}

	const handleSubmit = () => {
		var promises = [];
		setBusy(true);
		selectedPages.map(page => {
			if (page !== null && page !== undefined) {
				if (page.links.assign) {
					setPageStatus(page, 'processing')
					return promises.push(libraryService.post(page.links.assign, { AccountId: selectedAccount.id })
						.then(() => setPageStatus(page, 'complete'))
						.catch(() => setPageStatus(page, 'error')));
				}
				else {
					setPageStatus(page, 'skipped')
				}
			}

			return Promise.resolve();
		});

		Promise.all(promises)
			.then(() => setBusy(false))
			.catch(e => console.error(e));
	};

	const hasProcessablePages = pagesStatus.filter(x => x.assignStatus === 'error' || x.assignStatus === 'pending').length > 0;

	return (
		<EditorDialog show={open} busy={busy}
			title={<FormattedMessage id="pages.assignToUser" />}
			onCancelled={handleClose}  >
			<WritersDropDown onWriterSelected={(value) => setSelectedAccount(value)} fullWidth />
			<AssignList pages={pagesStatus} fullWidth />
			<Button aria-controls="get-text" aria-haspopup="false" onClick={handleSubmit}
				disabled={!selectedAccount || !hasProcessablePages}
				startIcon={<PersonAddIcon />} fullWidth
				variant="contained"
				color="primary">
				<FormattedMessage id="pages.assignToUser" />
			</Button>
		</EditorDialog >
	);
}

SimpleDialog.propTypes = {
	onClose: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
};

const PagePagesAssignButton = ({ selectedPages, onAssigned }) => {
	const [open, setOpen] = useState(false);
	const [selectedValue, setSelectedValue] = useState([]);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = (value) => {
		setOpen(false);
		setSelectedValue(value);
	};

	return (
		<>
			<Button disabled={selectedPages.length < 1} onClick={handleClickOpen} startIcon={<PersonAddIcon />}>
				<FormattedMessage id="pages.assignToUser" />
			</Button>
			<SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} onAssigned={onAssigned} selectedPages={selectedPages} />
		</>
	);
};

export default PagePagesAssignButton;
