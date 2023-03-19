import { Hono } from 'hono';

import presidents from '../../db/presidents.json';

export const presidentsRoute = new Hono();

presidentsRoute.get('/', (ctx) => {
	return ctx.json(presidents);
});

presidentsRoute.get('/:presidentID', (ctx) => {
	const id = ctx.req.param('presidentID');
	const targetPresident = presidents.find(p => p.id === id);

	return targetPresident
		? ctx.json(targetPresident)
		: ctx.json({ message: 'President not found' }, 404);
});
