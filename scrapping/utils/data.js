import { getLeaderboardList } from '../scrapers/leaderboard.js';
import { getMvpList } from '../scrapers/mvp.js';

export const SCRAPPING_DATA = {
  leaderboard: {
    url: 'https://kingsleague.pro/clasificacion/',
    scraper: getLeaderboardList
  },
  mvp: {
    url: 'https://kingsleague.pro/estadisticas/mvp/',
    scraper: getMvpList
  }
}
