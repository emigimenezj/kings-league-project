import { Hono } from 'hono';

import teams from '../../db/teams.json';

export const playersRoute = new Hono();

playersRoute.get('/', (ctx) => {
	const id = ctx.req.param('teamID');
	const { players } = teams.find(team => team.id === id);

	return players ? ctx.json(players) : ctx.json({ message: 'Team not found' }, 404);
});

playersRoute.get('/:playerID', (ctx) => {
	const teamID = ctx.req.param('teamID');
	const playerID = ctx.req.param('playerID');

	const team = teams.find(team => team.id === teamID);
	const players = team?.players;

	const player = players?.find(player => player.id.split('-').at(-1) === playerID);

	return player ? ctx.json(player) : ctx.json({ message: 'Team or player not found' }, 404);
});