import { ENTRY, CATEGORIES, SERIES, LATEST_BOOKS } from './actionTypes';

export function getEntry ()
{
	return async (dispatch, getState, { libraryService }) =>
	{
		const entry = await libraryService.getEntry();

		const [categories, series]
		= await Promise.all([
			libraryService.get(entry.links.categories),
			libraryService.get(entry.links.series)
		]);

		dispatch({
			type : ENTRY,
			payload : entry
		});

		dispatch({
			type : CATEGORIES,
			payload : categories
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

export function getLatestBooks ()
{
	return async (dispatch, getState, { libraryService }) =>
	{
		const latestBooks = await libraryService.getLatestBooks();
		dispatch({
			type : LATEST_BOOKS,
			payload : latestBooks
		});
	};
}
