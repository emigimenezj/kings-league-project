import { writeDBFile, TEAMS } from '../db/index.js';
import { SCRAPPING_URLS, scrape, cleanText } from './utils.js';

const MVP_SELECTORS = {
  team: '.fs-table-text_3',
  playerName: '.fs-table-text_4',
  gamesPlayed: '.fs-table-text_5',
  mvps: '.fs-table-text_6'
}

const $ = await scrape(SCRAPPING_URLS.mvp);
const $rows = $('table tbody tr');

const getImageFromTeam = name => {
  const { image } = TEAMS.find( team => team.name === name );
  return image
}

const mvpList = [];

$rows.each((index, el) => {

  const mvpPlayer = {};

  for (const key of Object.keys(MVP_SELECTORS)) {
    const selector = MVP_SELECTORS[key];
    const value = cleanText($(el).find(selector).text());

    mvpPlayer[key] = value;
  }

  const image = getImageFromTeam(mvpPlayer.team);

  mvpList.push({
    ...mvpPlayer,
    rank: index + 1,
    image
  });
});

await writeDBFile('mvpList', mvpList);
