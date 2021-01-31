import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChapterList from '../../components/chapters/chapterList';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { libraryService } from '../../services';

const ChaptersPage = () => {
	const { bookId } = useParams();
	const [book, setBook] = useState(null);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);

	const loadData = () => {
		libraryService.getBook(bookId)
			.then(data => setBook(data))
			.catch(() => setError(true))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		loadData();
	}, [bookId]);

	if (loading) return <Loading />

	if (error) return <ErrorMessage message="Error loading book." />

	if (book == null) return <ErrorMessage message="Book not found" />


	return (<ChapterList book={book} />);
};

export default ChaptersPage;
