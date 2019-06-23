import { tryAndWaitForTheElement } from 'wait-for-the-element';
import isElementDisplayed from '../helpers/isElementDisplayed';
import Anchor from './common/Anchor';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default class Header
{
	constructor (element)
	{
		this.element = element;
	}

	get isDisplayed ()
	{
		return isElementDisplayed(this.element);
	}

	static async logo ()
	{
		return new Anchor(await tryAndWaitForTheElement('.header__logo'));
	}
}
