import { Hono } from 'hono';

import top_scorers from '../../db/top_scorers.json';

export const topScorersRoute = new Hono();

topScorersRoute.get('/', (ctx) => {
	return ctx.json(top_scorers);
});

topScorersRoute.get('/:rank', (ctx) => {
	const rank = ~~ctx.req.param('rank');
	const player = top_scorers.find(player => player.rank === rank);

	return player ? ctx.json(player) : ctx.json({ message: 'Received range is out of limits.'}, 404);
});