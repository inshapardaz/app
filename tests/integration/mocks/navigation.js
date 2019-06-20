function preventLinksFromNavigating (event)
{
	if (event.target.tagName.toLowerCase() === 'a')
	{
		event.preventDefault();
	}
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

let isEnabled = true;

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export function disable ()
{
	if (isEnabled)
	{
		document.addEventListener('click', preventLinksFromNavigating, false);

		isEnabled = false;
	}
}

export function enable ()
{
	if (!isEnabled)
	{
		document.removeEventListener('click', preventLinksFromNavigating, false);

		isEnabled = true;
	}
}
