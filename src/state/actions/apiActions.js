import { ENTRY, CATEGORIES, SERIES, LATEST_BOOKS } from './actionTypes';

export function getEntry ()
{
	return async (dispatch, getState, { libraryService }) =>
	{
		const entry = await libraryService.getEntry();

		dispatch({
			type : ENTRY,
			payload : entry
		});

		const categories = libraryService.get(entry.links.categories);

		dispatch({
			type : CATEGORIES,
			payload : categories
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

export function getSeries (pageNumber = 1, pageSize = 10)
{
	return async (dispatch, getState, { libraryService }) =>
	{
		const series = await libraryService.getSeries(pageNumber, pageSize);
		dispatch({
			type : SERIES,
			payload : series
		});
	};
}
