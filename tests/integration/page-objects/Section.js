import { tryAndWaitForTheElement } from 'wait-for-the-element';
import isElementDisplayed from '../helpers/isElementDisplayed';
import Anchor from './common/Anchor';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default class Section
{
	constructor (element)
	{
		this.element = element;
	}

	get isDisplayed ()
	{
		return isElementDisplayed(this.element);
	}

	static async title ()
	{
		return new Anchor(await tryAndWaitForTheElement('.header__area > title__be--2'));
	}
}
