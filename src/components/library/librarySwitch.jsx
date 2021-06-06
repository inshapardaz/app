import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { libraryService } from '../../services';

const LibrarySwitch = () => {
	const { id } = useParams();
	const history = useHistory();

	libraryService.getLibraryById(id)
		.then((library) => {
			libraryService.setSelectedLibrary(library);
			history.push('/');
		})
		.catch((e) => {
			console.log(e);
			history.push('/error?reason=library_not_found');
		});

	return "";
}

export default LibrarySwitch;
