import isElementDisplayed from '../../helpers/isElementDisplayed';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default class Anchor
{
	constructor (element)
	{
		this.element = element;
	}

	get text ()
	{
		return this.element.textContent.trim();
	}

	get location ()
	{
		return this.element.getAttribute('href');
	}

	get isDisplayed ()
	{
		return isElementDisplayed(this.element);
	}

	get isExternal ()
	{
		return this.element.getAttribute('target') === '_blank';
	}

	click ()
	{
		this.element.click();
	}
}
