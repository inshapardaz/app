export default function triggerEvent (target, type, detail = {})
{
	let event, bubbles = true, cancelable = true;

	if (typeof CustomEvent === 'function')
	{
		event = new window.CustomEvent(type, {
			detail, bubbles, cancelable
		});
	}
	else
	{
		event = document.createEvent('CustomEvent');

		// Initialize.
		event.initCustomEvent(type, bubbles, cancelable, detail);
	}

	setTimeout(() =>
	{
		target.dispatchEvent(event);
	}, 0);
}
