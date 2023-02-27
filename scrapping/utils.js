import * as cheerio from 'cheerio';

export const SCRAPPING_URLS = {
  leaderboard: 'https://kingsleague.pro/clasificacion/',
  mvp: 'https://kingsleague.pro/estadisticas/mvp/'
}

export async function scrape(url) {
	const res = await fetch(url);
	const html = await res.text();
	return cheerio.load(html);
}

export function cleanText(text) {
	return text
		.replace(/\t|\n|\s:/g, '')
		.replace(/.*:/g, ' ')
		.trim()
}