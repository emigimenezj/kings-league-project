import { getLeaderboardList } from '../scrapers/leaderboard.js';
import { getMvpList } from '../scrapers/mvp.js';
import { getTopScorersList } from '../scrapers/top_scorers.js';
import { getAssistsList } from '../scrapers/top_assists.js';

export const SCRAPPING_DATA = {
  leaderboard: {
    url: 'https://kingsleague.pro/clasificacion/',
    scraper: getLeaderboardList
  },
  mvp: {
    url: 'https://kingsleague.pro/estadisticas/mvp/',
    scraper: getMvpList
  },
  top_scorers: {
    url: 'https://kingsleague.pro/estadisticas/goles/',
    scraper: getTopScorersList
  },
  top_assists: {
    url: 'https://kingsleague.pro/estadisticas/asistencias/',
    scraper: getAssistsList
  }
}
