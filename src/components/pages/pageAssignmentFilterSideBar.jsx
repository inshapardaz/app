import React from 'react';
import { useIntl } from "react-intl";
import GmailSidebarItem from '@mui-treasury/components/sidebarItem/gmail';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import PersonIcon from '@material-ui/icons/Person';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';

const PageAssignmentFilterSideBar = ({ assignmentFilter, onAssignmentFilterChanged }) => {
	const intl = useIntl();

	return (<>
		<GmailSidebarItem
			color={'#da3125'}
			startIcon={<FileCopyIcon />}
			label={intl.formatMessage({ id: "page.assign.all" })}
			selected={assignmentFilter == 'all'}
			onClick={() => onAssignmentFilterChanged('all')}
		/>
		<GmailSidebarItem
			color={'#da3125'}
			startIcon={<PersonIcon />}
			label={intl.formatMessage({ id: "page.assign.assignedToMe" })}
			selected={assignmentFilter == 'assignedToMe'}
			onClick={() => onAssignmentFilterChanged('assignedToMe')}
		/>
		<GmailSidebarItem
			color={'#da3125'}
			startIcon={<PeopleAltIcon />}
			label={intl.formatMessage({ id: "page.assign.assigned" })}
			selected={assignmentFilter == 'assigned'}
			onClick={() => onAssignmentFilterChanged('assigned')}
		/>
		<GmailSidebarItem
			color={'#da3125'}
			startIcon={<PersonOutlineIcon />}
			label={intl.formatMessage({ id: "page.assign.unassigned" })}
			selected={assignmentFilter == 'unassigned'}
			onClick={() => onAssignmentFilterChanged('unassigned')}
		/>
	</>);
};

export default PageAssignmentFilterSideBar;
