import path from 'node:path';
import sharp from 'sharp';

import { TEAMS, writeDBFile } from '../../db/index.js';
import { scrape } from '../utils/scrape.js';
import { cleanText } from '../utils/cleanText.js';

const TEAMS_ASSETS_PATH = path.join(process.cwd(), './assets/static/teams/');

const PLAYER_SELECTORS = {
  name: '.el-title',
  role: '.el-content',
  image: '.el-image'
}

async function getTeamsList() {
  const teams = [];

  const saveImage = async ({ url, folder, fileName }) => {
    const responseImage = await fetch(url);
    const arrayBuffer = await responseImage.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const formattedName = fileName
      .toLowerCase()
      .replaceAll(' ', '-')
      .normalize('NFD')
      .replace(/[^a-zA-Z0-9-]/g, '')
      + '.webp';
    
    const imageFilePath = path.join(TEAMS_ASSETS_PATH, folder, formattedName);
    await sharp(buffer).webp().toFile(imageFilePath);

    return formattedName;
  }

  for (const team of TEAMS) {
    const { id: teamId, name } = team;
    const players = [];

    const $ = await scrape('https://kingsleague.pro/team/' + teamId);
    const $list = $('ul.uk-slider-items li');

    console.log(`---------- [TEAM] ${name} ----------`);

    for (const elem of $list) {
      const $el = $(elem);

      const playerStatsClass = $el.find('.id-player').text().replace(' ', '-');

      const imageUrl = $el.find(PLAYER_SELECTORS.image).attr('src');

      const fullName = cleanText($(`.${playerStatsClass} h1`).text());
      const dorsalName = cleanText($el.find(PLAYER_SELECTORS.name).text());
      const dorsalRole = imageUrl.split('/').at(-1).split('.').at(0);      


      const $role = $el.find(PLAYER_SELECTORS.role);
      const roleRawValue = $role.contents().length > 1
        ? $role.contents().first().text()
        : $role.find('p').contents().first().text();
      const role = cleanText(roleRawValue);
      
      console.log(`${fullName.padEnd(25, ' ')} - ${role}`);

      let clubStats = {};
      let playerStats = {};
      let image = '';

      switch (role) {
        case 'presidente':
          continue;
        
        case 'entrenador': {
          image = await saveImage({ url: imageUrl, folder: 'coaches', fileName: `${teamId}-${dorsalName}` });

          team.coach = {
            fullName,
            dorsalName,
            dorsalRole,
            image
          }
          continue;
        }

        case 'jugador 11': {

          image = await saveImage({ url: imageUrl, folder: 'players', fileName: `${teamId}-${dorsalName}` });

          const $clubStats = $('.jugador-11 > div > div > div')
          .first()
          .children()
          .last()
          .find('> div > div');

          $clubStats.each((_, elem) => {
            const $statEl = $(elem);
            const statTitle = cleanText($statEl.find('.el-meta').text()).toLowerCase();
            const statValue = cleanText($statEl.find('.el-title').text());
            clubStats[statTitle] = Number(statValue);
          });
          break;
        }
        
        default: {

          image = await saveImage({ url: imageUrl, folder: 'players', fileName: `${teamId}-${dorsalName}` });

          const isGoalkeeper = role === 'Portero';

          const $clubStats = $(
            `.${playerStatsClass} .league-${isGoalkeeper?'goalk':'player'}`
          ).find('> div > div');

          const $playerStats = $(
            `.${playerStatsClass} .data-${isGoalkeeper?'goalk':'player'}`
          ).find('> div > div');

          $clubStats.each((_, elem) => {
            const $statEl = $(elem);
            const statTitle = cleanText($statEl.find('.el-meta').text()).toLowerCase();
            const statValue = cleanText($statEl.find('.el-title').text());
            clubStats[statTitle] = Number(statValue);
          });

          $playerStats.each((_, elem) => {
            const $statEl = $(elem);
            const statTitle = cleanText($statEl.find('.el-meta').text()).toLowerCase();
            const statValue = cleanText($statEl.find('.el-title').text());
            playerStats[statTitle] = Number(statValue);
          });

          const stats = Object.values(playerStats);
          const score = stats.reduce((rec, stat) => rec + stat) / stats.length;

          const availableStats = score !== 0;
          if (!availableStats) playerStats = {}
          else playerStats.score = score

        }
      }

      players.push({
        id: `${teamId}-${dorsalRole}`,
        fullName,
        dorsalName,
        dorsalRole,
        role,
        image,
        clubStats,
        playerStats
      });
    }

    teams.push({
      ...team,
      players
    });
  }

  return teams;
}

const teams = await getTeamsList();
await writeDBFile('teams', teams);
