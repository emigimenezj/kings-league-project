import { TEAMS } from '../../db/index.js';
import { cleanText } from '../utils/cleanText.js';

const MVP_SELECTORS = {
  team: '.fs-table-text_3',
  playerName: '.fs-table-text_4',
  gamesPlayed: '.fs-table-text_5',
  mvps: '.fs-table-text_6'
}

export function getMvpList($) {
  const $rows = $('table tbody tr');
  const mvpList = [];
  const getImage = name => TEAMS.find( team => team.name === name).image

  $rows.each((index, el) => {
    const mvpPlayer = {};

    for (const key of Object.keys(MVP_SELECTORS)) {
      const selector = MVP_SELECTORS[key];
      const value = cleanText($(el).find(selector).text());

      mvpPlayer[key] = value;
    }

    const image = getImage(mvpPlayer.team);

    mvpList.push({
      ...mvpPlayer,
      rank: index + 1,
      image
    });
  });

  return mvpList;
}
