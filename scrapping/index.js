import { SCRAPPING_DATA } from './utils/data.js';
import { logInfo } from './utils/log.js';
import { scrapeAndSave } from './utils/scrape.js';

logInfo('Starting scraping phase.');

const start = performance.now();

for (const key of Object.keys(SCRAPPING_DATA))
  await scrapeAndSave(key);

const end = performance.now();

const time = (end - start) / 1000;
logInfo(`Global time of scraping phase process: ${time} seconds.`);

logInfo('Finishing scraping phase.');