import { SCRAPPING_DATA } from './utils/data.js';
import { logInfo, logSuccess } from './utils/log.js';
import { scrapeAndSave } from './utils/scrape.js';

logInfo('Starting scraping phase.');

const start = performance.now();

for (const key of Object.keys(SCRAPPING_DATA))
  await scrapeAndSave(key);

const end = performance.now();

const time = (end - start) / 1000;
logSuccess(`Scraping phase success in ${time} seconds.`);

logInfo('Finishing scraping phase.');