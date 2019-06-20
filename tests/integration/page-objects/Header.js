import isElementDisplayed from '../helpers/isElementDisplayed';

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

	get isNative ()
	{
		return this.element.hasAttribute('native-mobile-app');
	}
}
