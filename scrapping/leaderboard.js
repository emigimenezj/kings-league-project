import * as cheerio from 'cheerio';

import { writeDBFile, TEAMS, PRESIDENTS } from '../db/index.js';

const URLS = {
	leaderboard: 'https://kingsleague.pro/clasificacion/'
}

async function scrape (url) {
	const res = await fetch(url);
	const html = await res.text();
	return cheerio.load(html);
}

async function getLeaderBoard () {
	const $ = await scrape(URLS.leaderboard);
	const $rows = $('table tbody tr');

	const LEADERBOARD_SELECTORS = {
		team: '.fs-table-text_3',
		wins: '.fs-table-text_4',
		loses: '.fs-table-text_5',
		goalsScored: '.fs-table-text_6',
		goalsConceded: '.fs-table-text_7',
		goalsDifference: '.fs-table-text_8'
	}

	const getTeamFromDB = name => {
		const { presidentId, ...restOfTeam } = TEAMS.find(team => team.name === name);
		const president = PRESIDENTS.find(president => president.id === presidentId);
		return { ...restOfTeam, president };
	}

	const cleanText = text => text
		.replace(/\t|\n|\s:/g, '')
		.replace(/.*:/g, ' ')
		.trim()

	const leaderboard = [];
	$rows.each((_, el) => {

		const leaderboardForTeam = {};

		for (const key of Object.keys(LEADERBOARD_SELECTORS)) {
			const selector = LEADERBOARD_SELECTORS[key];
			const value = cleanText($(el).find(selector).text());

			leaderboardForTeam[key] = value;
		}

		const team = getTeamFromDB(leaderboardForTeam.team);

		leaderboard.push({
			...leaderboardForTeam,
			team
		});
	});

	return leaderboard;
}

const leaderboard = await getLeaderBoard();

console.log(leaderboard);

await writeDBFile('leaderboard', leaderboard);