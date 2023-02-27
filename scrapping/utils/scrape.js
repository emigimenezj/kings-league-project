import * as cheerio from 'cheerio';
import { writeDBFile } from '../../db/index.js';
import { SCRAPPING_DATA } from './data.js';
import { logInfo, logSuccess, logError } from './log.js';

async function scrape(url) {
	const res = await fetch(url);
	const html = await res.text();
	return cheerio.load(html);
}

export async function scrapeAndSave(name) {

  const nameFormatted = `[${name}]`;

  const start = performance.now();

  try {

    logInfo(`Scrapping ${nameFormatted} list...`);
    const { url, scraper } = SCRAPPING_DATA[name];
    const $ = await scrape(url);
    const content = await scraper($);
    logSuccess(`${nameFormatted} list scrapped successfully.`);

    logInfo(`Writing ${nameFormatted} list to database...`);
    await writeDBFile(name, content);
    logSuccess(`${nameFormatted} list writed successfully.`);

  } catch(error) {
    logError(`Error in ${nameFormatted} list scraping phase.`);
    logError(error);
  } finally {
    const end = performance.now();
    const time = (end - start) / 1000;
    logInfo(`${nameFormatted} scraped in ${time} seconds.`);
  }
}