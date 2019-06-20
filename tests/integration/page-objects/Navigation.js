import isElementDisplayed from '../helpers/isElementDisplayed';
import Anchor             from './common/Anchor';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export class NavigationLink extends Anchor
{
	get isActive ()
	{
		return this.element.classList.contains('navigation__link--active');
	}
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export default class Navigation
{
	constructor (element)
	{
		this.element = element;
	}

	get linkToReporting ()
	{
		return new NavigationLink(
			this.element.querySelector('.navigation__tab:nth-child(1) .navigation__link')
		);
	}

	get linkToPerformance ()
	{
		return new NavigationLink(
			this.element.querySelector('.navigation__tab:nth-child(2) .navigation__link')
		);
	}

	get linkToSegmentation ()
	{
		return new NavigationLink(
			this.element.querySelector('.navigation__tab:nth-child(3) .navigation__link')
		);
	}

	get isDisplayed ()
	{
		return isElementDisplayed(this.element);
	}
}
