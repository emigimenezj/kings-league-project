import { TEAMS, PRESIDENTS } from '../../db/index.js';
import { cleanText } from '../utils/cleanText.js';

const LEADERBOARD_SELECTORS = {
	team: '.fs-table-text_3',
	wins: '.fs-table-text_4',
	losses: '.fs-table-text_5',
	goalsScored: '.fs-table-text_6',
	goalsConceded: '.fs-table-text_7',
	goalsDifference: '.fs-table-text_8'
}

export function getLeaderboardList($) {
	const $rows = $('table tbody tr');
	const leaderboard = [];
	const getTeam = name => {
		const { presidentId, ...restOfTeam } = TEAMS.find(team => team.name === name);
		const president = PRESIDENTS.find(president => president.id === presidentId);
		return { ...restOfTeam, president };
	}

	$rows.each((_, el) => {
		const leaderboardForTeam = {};

		for (const key of Object.keys(LEADERBOARD_SELECTORS)) {
			const selector = LEADERBOARD_SELECTORS[key];
			const value = cleanText($(el).find(selector).text());

			leaderboardForTeam[key] = value;
		}

		const team = getTeam(leaderboardForTeam.team);

		leaderboard.push({
			...leaderboardForTeam,
			team
		});
	});

	return leaderboard;
}
