import { tryAndWaitForTheElement } from 'wait-for-the-element';
import isElementDisplayed from '../helpers/isElementDisplayed';
import Image from './common/Image';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default class Logo
{
	constructor (element)
	{
		this.element = element;
	}

	get isDisplayed ()
	{
		return isElementDisplayed(this.element);
	}

	get location ()
	{
		return this.element.getAttribute('href');
	}

	static async image ()
	{
		return new Image(await tryAndWaitForTheElement('.header__logo img'));
	}
}
