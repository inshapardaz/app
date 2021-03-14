import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { libraryService } from '../../services';

const LibrarySwitch = () => {
	const { id } = useParams();
	const history = useHistory();

	console.log(`loading dictionary ${id}`);
	libraryService.getLibraryById(id)
		.then((library) => {
			console.log(library);
			libraryService.setSelectedLibrary(library);
			history.push('/');
		})
		.catch((e) => {
			console.log(e);
			history.push('/error?reason=library_not_found');
		})
		.finally(() => console.log('end'));

	return "";
}

export default LibrarySwitch;
