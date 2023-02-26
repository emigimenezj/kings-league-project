import { Hono } from 'hono';
import { serveStatic } from 'hono/serve-static.module';
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
		{
			endpoint: '/emi',
			description: 'totally pwned by emi :v'
		}
	]);
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
});

app.get('/teams', (ctx) => {
	return ctx.json(teams);
});

app.get('/teams/:id', (ctx) => {
	const id = ctx.req.param('id');
	const team = teams.find(team => team.id === id);
	
	return team ? ctx.json(team) : ctx.json({ message: 'Team not found' }, 404);
});

app.get('/emi', (ctx) => {
	return ctx.json({message: 'emi was here :v'});
})

app.get('/static/*', serveStatic({ root: './' }));

app.notFound((ctx) => {
	const url = ctx.req.url;
	const { pathname } = new URL(url);
	
	if (url.at(-1) === '/')
		return ctx.redirect(pathname.slice(0, -1))
	
	return ctx.json({ message: 'Not Found'}, 404);
});

export default app;