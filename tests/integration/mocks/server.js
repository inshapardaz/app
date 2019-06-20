import { fakeServer } from 'sinon';

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

let server = fakeServer.create({
	respondImmediately : true
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - -

export function fake (url, {
	status = 200, headers = {}, body
})
{
	server.respondWith(url, [
		status, headers, body
	]);
}

export function fakeJsonFeed (url, {
	status = 200, headers = {}, body = {}
})
{
	const json = JSON.stringify(body);

	server.respondWith(url, [
		status,
		Object.assign({
			'Content-Type' : 'application/json'
		}, headers),
		json
	]);
}

export function reset ()
{
	server.reset();
}
