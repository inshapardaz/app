import { Container } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { libraryService } from '../../services';

const ChapterPage = () => {
	const { bookId, id } = useParams();
	const [contents, setContents] = useState(null);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);

	const loadData = () => {
		libraryService.getChapterContents(id)
			.then(data => setContents(data))
			.catch(() => setError(true))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		loadData();
	}, [id]);

	return (<Container maxWidth="sm" >
		{contents}
	</Container>);
};

export default ChapterPage;
