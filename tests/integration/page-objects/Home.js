import { tryAndWaitForTheElement } from 'wait-for-the-element';
import Header                      from './Header';

export default class Home
{
	static async header ()
	{
		const element = await tryAndWaitForTheElement('.header');
		return new Header(element);
	}
}
