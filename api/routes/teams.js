import { Hono } from 'hono';

import teams from '../../db/teams.json';

import { playersRoute } from './players.js';

export const teamsRoute = new Hono();

teamsRoute.get('/', (ctx) => {
	return ctx.json(teams);
});

teamsRoute.get('/:teamID', (ctx) => {
	const id = ctx.req.param('teamID');
	const team = teams.find(team => team.id === id);
	
	return team ? ctx.json(team) : ctx.json({ message: 'Team not found' }, 404);
});

teamsRoute.route('/:teamID/players', playersRoute);
