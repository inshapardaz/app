import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';
import Tabs from '@material-ui/core/Tabs';
import InfoIcon from '@material-ui/icons/Info';
import PagesIcon from '@material-ui/icons/Pages';
import Tab from '@material-ui/core/Tab';
import TocIcon from '@material-ui/icons/Toc';
import Box from '@material-ui/core/Box';
import ChapterList from '../../components/chapters/chapterList';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { libraryService } from '../../services';
import BookEditorForm from '../../components/books/bookEditorForm';

const TabPanel = (props) => {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3}>
					{children}
				</Box>
			)}
		</div>
	);
};

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

const BookEditorPage = () => {
	const intl = useIntl();
	const { id } = useParams();
	const [selectedTab, setSelectedTab] = useState(0);
	const [book, setBook] = useState(null);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);

	const loadData = () => {
		libraryService.getBook(id)
			.then(data => setBook(data))
			.catch(() => setError(true))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		loadData();
	}, [id]);

	if (loading) return <Loading />

	if (error) return <ErrorMessage message="Error loading book." />

	if (book == null) <ErrorMessage message="Book not found" />

	return (<>
		<Tabs
			value={selectedTab}
			onChange={(e, newValue) => setSelectedTab(newValue)}
			indicatorColor="primary"
			textColor="primary"
			centered
		>
			<Tab label="Description" icon={<InfoIcon />} {...a11yProps(0)} />
			<Tab label="Chapters" icon={<TocIcon />} {...a11yProps(0)} />
			<Tab label="Pages" icon={<PagesIcon />} {...a11yProps(0)} />
		</Tabs>
		<TabPanel value={selectedTab} index={0}>
			<BookEditorForm book={book} />
		</TabPanel>
		<TabPanel value={selectedTab} index={1}>
			<ChapterList book={book} />
		</TabPanel>
		<TabPanel value={selectedTab} index={2}>
			Item Three
		</TabPanel>
	</>);
};

export default BookEditorPage;
