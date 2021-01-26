import { Container } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';

import { libraryService } from '../../services';

const ChapterEditorPage = () => {
	const { bookId, id } = useParams();
	const [chapter, setChapter] = useState(null);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);

	const loadData = () => {
		libraryService.getChapter(bookId, id)
			.then(data => setChapter(data))
			.catch(() => setError(true))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		loadData();
	}, [id]);

	return (<Container maxWidth="sm" >
		<TextField
			id="outlined-multiline-static"
			label="Multiline"
			multiline
			rows={4}
			defaultValue={chapter && chapter.contents}
			variant="outlined"
		/>
	</Container>);
};

export default ChapterEditorPage;
