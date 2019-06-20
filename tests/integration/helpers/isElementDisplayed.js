export default function isElementVisible (element)
{
	return element !== null && element.getClientRects().length > 0 && window.getComputedStyle(element).display !== 'none';
}
