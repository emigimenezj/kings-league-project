import { Hono } from 'hono';

import top_assists from '../../db/top_assists.json';

export const topAssistsRoute = new Hono();

topAssistsRoute.get('/', (ctx) => {
	return ctx.json(top_assists);
});

topAssistsRoute.get('/:rank', (ctx) => {
	const rank = ~~ctx.req.param('rank');
	const player = top_assists.find(player => player.rank === rank);

	return player ? ctx.json(player) : ctx.json({ message: 'Received range is out of limits.'}, 404);
});