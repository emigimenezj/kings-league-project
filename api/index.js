import { Hono } from 'hono';
import { serveStatic } from 'hono/serve-static.module'
import leaderboard from '../db/leaderboard.json';
import presidents from '../db/presidents.json';
import teams from '../db/teams.json';

const app = new Hono();

app.get('/', (ctx) => {
	return ctx.json([
		{
			endpoint: '/leaderboard',
			description: 'Returns the leaderboard'
		},
		{
			endpoint: '/presidents',
			description: 'Returns Kings League presidents'
		},
		{
			endpoint: '/teams',
			description: 'Returns Kings League teams'
		},
	])
});

app.get('/leaderboard', (ctx) => {
	return ctx.json(leaderboard);
});

app.get('/presidents', (ctx) => {
	return ctx.json(presidents);
});

app.get('/presidents/:id', (ctx) => {
	const { id } = ctx.req.param();
	const targetPresident = presidents.find(p => p.id === id);

	return targetPresident
		? ctx.json(targetPresident)
		: ctx.json({ message: 'President not found' }, 404);
})

app.get('/teams', (ctx) => {
	return ctx.json(teams);
});

app.get('/static/*', serveStatic({ root: './' }));

export default app;