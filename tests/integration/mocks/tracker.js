window.dataLayer = [];

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export function latest ()
{
	return window.dataLayer[window.dataLayer.length - 1];
}

export function reset ()
{
	window.dataLayer.length = 0;
}
