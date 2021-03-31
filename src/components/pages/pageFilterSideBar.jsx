import React from 'react';
import { useIntl } from "react-intl";
import GmailSidebarItem from '@mui-treasury/components/sidebarItem/gmail';
import PageStatusIcon from '../../components/pages/pageStatusIcon';

const getPageCountInStatus = (book, status) => {
	if (book && book.pageStatus) {
		let stat = book.pageStatus.find(s => s.status === status);
		if (stat) return stat.count;
	}

	return null;
}

const PageFilterSideBar = ({ book, filter, setFilter }) => {
	const intl = useIntl();

	return (<>
		<GmailSidebarItem
			color={'#e37400'}
			startIcon={<PageStatusIcon status="AllPages" tooltip={false} />}
			label={intl.formatMessage({ id: "page.all" })}
			amount={book.pageCount}
			selected={filter === 'all'}
			onClick={() => setFilter('all')}
		/>

		<GmailSidebarItem
			color={'#da3125'}
			startIcon={<PageStatusIcon status="Available" tooltip={false} />}
			label={intl.formatMessage({ id: "status.Available" })}
			amount={getPageCountInStatus(book, 'Available')}
			selected={filter === 'available'}
			onClick={() => setFilter('available')}
		/>

		<GmailSidebarItem
			color={'#da3125'}
			startIcon={<PageStatusIcon status="Typing" tooltip={false} />}
			label={intl.formatMessage({ id: "status.Typing" })}
			amount={getPageCountInStatus(book, 'Typing')}
			selected={filter === 'typing'}
			onClick={() => setFilter('typing')}
		/>

		<GmailSidebarItem
			color={'#da3125'}
			startIcon={<PageStatusIcon status="Typed" tooltip={false} />}
			label={intl.formatMessage({ id: "status.Typed" })}
			amount={getPageCountInStatus(book, 'Typed')}
			selected={filter === 'typed'}
			onClick={() => setFilter('typed')}
		/>

		<GmailSidebarItem
			color={'#da3125'}
			startIcon={<PageStatusIcon status="InReview" tooltip={false} />}
			label={intl.formatMessage({ id: "status.InReview" })}
			amount={getPageCountInStatus(book, 'InReview')}
			selected={filter === 'inReview'}
			onClick={() => setFilter('inReview')}
		/>

		<GmailSidebarItem
			color={'#da3125'}
			startIcon={<PageStatusIcon status="Completed" tooltip={false} />}
			label={intl.formatMessage({ id: "status.Completed" })}
			amount={getPageCountInStatus(book, 'Completed')}
			selected={filter === 'completed'}
			onClick={() => setFilter('completed')}
		/>
	</>);
};

export default PageFilterSideBar;
