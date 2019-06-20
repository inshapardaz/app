import LibraryService from '../../services/LibraryService';
import { ENTRY, LANGUAGES, ATTRIBUTES, RELATIONSHIPTYPES, CATEGORIES, SERIES } from './actionTypes';

export function getEntry ()
{
	return async (dispatch) =>
	{
		const entry = await LibraryService.getEntry();

		const [languages, attributes, relationshipTypes, categories, series]
		= await Promise.all([
			LibraryService.get(entry.links.languages),
			LibraryService.get(entry.links.attributes),
			LibraryService.get(entry.links.relationshiptypes),
			LibraryService.get(entry.links.categories),
			LibraryService.get(entry.links.series)
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
			type : RELATIONSHIPTYPES,
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
	return async (dispatch, getState) =>
	{
		await LibraryService.post(addLink, { name });
		const categories = await LibraryService.get(getState().apiReducers.entry.links.categories);
		dispatch({
			type : CATEGORIES,
			payload : categories
		});
	};
}

export function addSeries (addLink, name)
{
	return async (dispatch, getState) =>
	{
		await LibraryService.post(addLink, { name });
		const series = await LibraryService.get(getState().apiReducers.entry.links.series);
		dispatch({
			type : SERIES,
			payload : series
		});
	};
}
