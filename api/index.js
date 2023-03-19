import { Hono } from 'hono';
import { serveStatic } from 'hono/serve-static.module';

import leaderboard from '../db/leaderboard.json';
import mvp from '../db/mvp.json';
import player_twelve from '../db/player_twelve.json';

import { teamsRoute } from './routes/teams';
import { presidentsRoute } from './routes/presidents';
import { coachesRoute } from './routes/coaches';
import { topScorersRoute } from './routes/top_scorers';
import { topAssistsRoute } from './routes/top_assists';


const app = new Hono();

/*
[x] GET /teams/:id/player-12: Devuelve un jugador 12 de un equipo de la Kings League.
[x] GET /teams/:id/players/:playerId: Devuelve un jugador de un equipo de la Kings League.

[x] GET /coaches: Devuelve todos los entrenadores de la Kings League.
[x] GET /coaches/:teamId: Devuelve el entrenador de un equipo de la Kings League.

[x] GET /top-assists: Devuelve los asistentes más destacados de la Kings League.
[x] GET /top-assists/:rank: Devuelve el asistente más destacado de acuerdo a su posición en el ranking de la Kings League.

[ ] GET /schedule: Devuelve el calendario de partidos de la Kings League y el resultado de los partidos jugados.

[x] GET /players-12: Devuelve los jugadores 12 de la Kings League.
*/

app.get('/', (ctx) => {
	return ctx.json([
		{
			endpoint: '/leaderboard',
			description: 'Returns Kings League leaderboard'
		},
		{
			endpoint: '/teams',
			description: 'Returns all the teams of Kings League',
			subroutes: {
				endpoint: '/teams/:id',
				description: 'Returns a team of Kings League',
				subroutes: {
					endpoint: '/teams/:id/players',
					description: 'Returns all the Kings League team players',
					subroutes: {
						endpoint: '/teams/:teamID/players/:playerID',
						description: 'Returns a player of a Kings League team'
					},
				},
			},
		},
		{
			endpoint: '/presidents',
			description: 'Returns all Kings League presidents',
			subroutes: {
				endpoint: '/presidents/:id',
				description: 'Returns a president of a Kings League team'
			},
		},
		
		{
			endpoint: '/coaches',
			description: 'Returns all Kings League coaches',
			subroutes: {
				endpoint: '/coaches/:id',
				description: 'Returns the coach of a Kings League team'
			},
		},
		{
			endpoint: '/top-scorers',
			description: 'Returns the top scorers in the Kings League (top 50)',
			subroutes: {
				endpoint: '/top-scorers/:rank',
				description: 'Returns the top scorer according to their position in the Kings League ranking (only top 50)'
			},
		},
		{
			endpoint: '/top-assists',
			description: 'Returns the top assistants in the Kings League (top 50)',
			subroutes: {
				endpoint: '/top-assists/:rank',
				description: 'Returns the top assistant according to their position in the Kings League ranking (only top 50)'
			},
		},
		{
			endpoint: '/mvp',
			description: 'Returns the Kings League most valuable player list (only players who have at least 1 MVP)'
		},
		{
			endpoint: '/players-12',
			description: 'Returns all the players 12 of the Kings League'
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

app.route('/teams', teamsRoute);
app.route('/presidents', presidentsRoute);
app.route('/coaches', coachesRoute);
app.route('/top-scorers', topScorersRoute);
app.route('/top-assists', topAssistsRoute);

app.get('/mvp', (ctx) => {
	return ctx.json(mvp);
});

app.get('/players-12', (ctx) => {
	return ctx.json(player_twelve);
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