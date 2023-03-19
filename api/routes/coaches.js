import { Hono } from 'hono';

import teams from '../../db/teams.json';

export const coachesRoute = new Hono();

coachesRoute.get('/', (ctx) => {
	const coaches = teams.map(team => team.coach);

	return ctx.json(coaches);
});

coachesRoute.get('/:teamID', (ctx) => {
	const teamID = ctx.req.param('teamID');
	const team = teams.find(team => team.id === teamID);

	const coach = team?.coach;

	return coach ? ctx.json(coach) : ctx.json({ message: 'Team not found' }, 404);
});