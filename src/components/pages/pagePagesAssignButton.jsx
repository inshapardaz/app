import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import { FormattedMessage, useIntl } from "react-intl";
import WritersDropDown from '../account/writersDropdown';
import EditorDialog from '../editorDialog';
import { libraryService } from "../../services";
import ProcessingStatusIcon, { ProcessingStatus } from '../processingStatusIcon';

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
							<TableCell align="right"><ProcessingStatusIcon status={page.assignStatus} /></TableCell>
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
			setPagesStatus(selectedPages.map(p => ({ sequenceNumber: p.sequenceNumber, assignStatus: ProcessingStatus.Pending })))
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
					setPageStatus(page, ProcessingStatus.Processing)
					return promises.push(libraryService.post(page.links.assign, { AccountId: selectedAccount.id })
						.then(() => setPageStatus(page, ProcessingStatus.Complete))
						.catch(() => setPageStatus(page, ProcessingStatus.Error)));
				}
				else {
					setPageStatus(page, ProcessingStatus.Skipped)
				}
			}

			return Promise.resolve();
		});

		Promise.all(promises)
			.then(() => setBusy(false))
			.catch(e => console.error(e));
	};

	const hasProcessablePages = pagesStatus.filter(x => x.assignStatus === ProcessingStatus.Error || x.assignStatus === ProcessingStatus.Pending).length > 0;

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
