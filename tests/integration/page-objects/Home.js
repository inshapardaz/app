import { tryAndWaitForTheElement } from 'wait-for-the-element';
import Header                      from './Header';
import Section 					   from './Section';

export default class Home
{
	static async header ()
	{
		const element = await tryAndWaitForTheElement('.header');
		return new Header(element);
	}

	static async latestBooks ()
	{
		const element = await tryAndWaitForTheElement('.header__area');
		return new Section(element);
	}
}
