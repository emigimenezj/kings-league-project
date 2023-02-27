import { SCRAPPING_URLS, scrape, cleanText } from './utils.js';
import { writeDBFile, TEAMS, PRESIDENTS } from '../db/index.js';

const LEADERBOARD_SELECTORS = {
	team: '.fs-table-text_3',
	wins: '.fs-table-text_4',
	losses: '.fs-table-text_5',
	goalsScored: '.fs-table-text_6',
	goalsConceded: '.fs-table-text_7',
	goalsDifference: '.fs-table-text_8'
}

function getTeamFromDB(name) {
	const { presidentId, ...restOfTeam } = TEAMS.find(team => team.name === name);
	const president = PRESIDENTS.find(president => president.id === presidentId);
	return { ...restOfTeam, president };
}

const $ = await scrape(SCRAPPING_URLS.leaderboard);
const $rows = $('table tbody tr');

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

await writeDBFile('leaderboard', leaderboard);
