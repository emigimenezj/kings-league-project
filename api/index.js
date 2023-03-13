import { Hono } from 'hono';
import { serveStatic } from 'hono/serve-static.module';
import leaderboard from '../db/leaderboard.json';
import presidents from '../db/presidents.json';
import teams from '../db/teams.json';
import mvp from '../db/mvp.json';
import top_scorers from '../db/top_scorers.json';


const app = new Hono();

app.get('/', (ctx) => {
	return ctx.json([
		{
			endpoint: '/leaderboard',
			description: 'Returns Kings League leaderboard'
		},
		{
			endpoint: '/presidents',
			description: 'Returns Kings League presidents'
		},
		{
			endpoint: '/presidents/:id',
			description: "Returns a specific Kings League's president"
		},
		{
			endpoint: '/teams',
			description: 'Returns Kings League teams'
		},
		{
			endpoint: '/teams/:id',
			description: "Returns a specific Kings League's team"
		},
		{
			endpoint: '/mvp',
			description: 'Returns Kings League most valuable player'
		},
		{
			endpoint: '/top-scorers',
			description: 'Returns Kings League top scorer players'
		},
		{
			endpoint: '/top-scorers/:rank',
			description: "Returns the Kings League's player at the rank provided only if he is in the top 50."
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

app.get('/mvp', (ctx) => {
	return ctx.json(mvp);
});

app.get('/top-scorers', (ctx) => {
	return ctx.json(top_scorers);
});

app.get('/top-scorers/:rank', (ctx) => {
	const rank = ~~ctx.req.param('rank');
	const player = top_scorers.find(player => player.rank === rank);

	return player ? ctx.json(player) : ctx.json({ message: 'Received range is out of limits.'}, 404);
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