import { TEAMS } from '../../db/index.js';
import { cleanText } from '../utils/cleanText.js';

const ASSISTANTS_SELECTORS = {
  team: '.fs-table-text_3',
  playerName: '.fs-table-text_4',
  gamesPlayed: '.fs-table-text_5',
  assists: '.fs-table-text_6'
}

export function getAssistsList($) {
  const $rows = $('table tbody tr');
  const topAssistsList = [];

  $rows.each((index, el) => {
    const topAssistant = {};

    for (const key of Object.keys(ASSISTANTS_SELECTORS)) {
      const selector = ASSISTANTS_SELECTORS[key];
      const value = cleanText($(el).find(selector).text());

      topAssistant[key] = /^\d+$/.test(value) ? ~~value : value;
    }

    const { image } = TEAMS.find(team => team.name === topAssistant.team);

    topAssistsList.push({
      ...topAssistant,
      rank: index + 1,
      image
    });
  });

  return topAssistsList;
}
