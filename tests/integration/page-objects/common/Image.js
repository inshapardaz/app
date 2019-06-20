import isElementDisplayed from '../../helpers/isElementDisplayed';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default class Image
{
	constructor (element)
	{
		this.element = element;
	}

	get source ()
	{
		return this.element.getAttribute('src');
	}

	get title ()
	{
		return this.element.getAttribute('alt');
	}

	get isDisplayed ()
	{
		return isElementDisplayed(this.element);
	}
}
