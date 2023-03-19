import { TEAMS } from '../../db/index.js';
import { cleanText } from '../utils/cleanText.js';

const SCORERS_SELECTORS = {
  team: '.fs-table-text_3',
  playerName: '.fs-table-text_4',
  gamesPlayed: '.fs-table-text_5',
  goals: '.fs-table-text_6'
}

export function getTopScorersList($) {
  const $rows = $('table tbody tr');
  const topScorersList = [];

  $rows.each((index, el) => {
    const topScorer = {};

    for (const key of Object.keys(SCORERS_SELECTORS)) {
      const selector = SCORERS_SELECTORS[key];
      const value = cleanText($(el).find(selector).text());

      topScorer[key] = value;
    }

    const { image } = TEAMS.find(team => team.name === topScorer.team);

    topScorersList.push({
      ...topScorer,
      rank: index + 1,
      image
    });
  });

  return topScorersList;
}