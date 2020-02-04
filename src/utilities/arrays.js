export function chunkArray (myArray, chunkSize = 3)
{
	let index = 0;
	const arrayLength = myArray.length;
	const tempArray = [];

	for (index = 0; index < arrayLength; index += chunkSize)
	{
		tempArray.push(myArray.slice(index, index + chunkSize));
	}

	return tempArray;
}
