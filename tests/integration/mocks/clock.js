import { useFakeTimers } from 'sinon';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

useFakeTimers({
	now    : 0,
	toFake : ['Date']
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export function set (now)
{
	Date.clock.setSystemTime(now);
}

export function reset ()
{
	Date.clock.reset();
}
