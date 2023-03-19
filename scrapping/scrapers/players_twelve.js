import { cleanText } from '../utils/cleanText.js';

const PLAYER_TWELVE_SELECTORS = {
  firstName: '.fs-grid-meta-3',
  lastName: '.fs-grid-text-3',
  teamName: '.uk-text-lead',
  role: '.fs-grid-meta-1',
  journeys: 'tag'
}

export function getPlayerTwelveList($) {
  const $rows = $('div.fs-load-more-item.fs-mw');
  const playerTwelveList = [];

  $rows.each((_, el) => {

    const playerTwelveFromScrape = {};
    const $el = $(el);

    for (const key of Object.keys(PLAYER_TWELVE_SELECTORS)) {
      const selector = PLAYER_TWELVE_SELECTORS[key];
      const value = cleanText($el.find(selector).text());

      playerTwelveFromScrape[key] = value;
    }

    const {firstName, lastName, ...playerTwelve} = playerTwelveFromScrape;
    playerTwelve.name = `${firstName} ${lastName}`;

    const journeys = $el
      .data(PLAYER_TWELVE_SELECTORS.journeys)
      .toString()
      .split(' ')
      .filter(Boolean)
      .map(s => ~~s);

    playerTwelveList.push({
      ...playerTwelve,
      journeys
    });
  });

  return playerTwelveList;
}