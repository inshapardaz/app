import { ENTRY, LANGUAGES, ATTRIBUTES, RELATIONSHIP_TYPES, CATEGORIES, SERIES } from './actionTypes';

export function getEntry ()
{
	return async (dispatch, getState, { libraryService }) =>
	{
		const entry = await libraryService.getEntry();

		const [languages, attributes, relationshipTypes, categories, series]
		= await Promise.all([
			libraryService.get(entry.links.languages),
			libraryService.get(entry.links.attributes),
			libraryService.get(entry.links.relationshiptypes),
			libraryService.get(entry.links.categories),
			libraryService.get(entry.links.series)
		]);

		dispatch({
			type : ENTRY,
			payload : entry
		});

		dispatch({
			type : LANGUAGES,
			payload : languages
		});

		dispatch({
			type : ATTRIBUTES,
			payload : attributes
		});

		dispatch({
			type : CATEGORIES,
			payload : categories
		});

		dispatch({
			type : RELATIONSHIP_TYPES,
			payload : relationshipTypes
		});

		dispatch({
			type : SERIES,
			payload : series
		});
	};
}

export function addCategory (addLink, name)
{
	return async (dispatch, getState, { libraryService }) =>
	{
		await libraryService.post(addLink, { name });
		const categories = await libraryService.get(getState().apiReducers.entry.links.categories);
		dispatch({
			type : CATEGORIES,
			payload : categories
		});
	};
}

export function addSeries (addLink, name)
{
	return async (dispatch, getState, { libraryService }) =>
	{
		await libraryService.post(addLink, { name });
		const series = await libraryService.get(getState().apiReducers.entry.links.series);
		dispatch({
			type : SERIES,
			payload : series
		});
	};
}
