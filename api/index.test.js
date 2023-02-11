import { unstable_dev } from 'wrangler';
import { describe, expect, it, beforeAll, afterAll } from 'vitest';

describe('testing / route', () => {
	let worker;

	beforeAll(async () => {
		worker = await unstable_dev(
			'api/index.js',
			{ experimental: { disableExperimentalWarning: true }},
		);
	});

	afterAll(async () => {
		await worker.stop();
	});

	it('all routes should have endpoint and description', async () => {
		const response = await worker.fetch();
		if (response) {
			const apiRoutes = await response.json();
			apiRoutes.forEach(endpoint => {
				expect(endpoint).toHaveProperty('endpoint');
				expect(endpoint).toHaveProperty('description');
			});
			expect(response.status).toEqual(200);
		}
	});
});

describe('testing /teams routes', () => {
	let worker;

	beforeAll(async () => {
		worker = await unstable_dev(
			'api/index.js',
			{ experimental: { disableExperimentalWarning: true }},
		);
	});

	afterAll(async () => {
		await worker.stop();
	});

	const checkProps = team => {
		expect(team).toHaveProperty('id');
		expect(team).toHaveProperty('name');
		expect(team).toHaveProperty('image');
		expect(team).toHaveProperty('url');
		expect(team).toHaveProperty('presidentId');
		expect(team).toHaveProperty('channel');
		expect(team).toHaveProperty('coach');
		expect(team).toHaveProperty('socialNetworks');
		expect(team).toHaveProperty('players');
	}

	it('all teams should have all props', async () => {
		const response = await worker.fetch('/teams');
		if (response) {
			const teams = await response.json();
			teams.forEach(team => checkProps(team));
			expect(response.status).toEqual(200);
		}
	});

	it('endpoint for a particular team should have all props', async () => {
		const response = await worker.fetch('/teams/1k');
		if (response) {
			const team = await response.json();
			checkProps(team);
			expect(response.status).toEqual(200);
		}
	});

	it ('endpoint should return 404 message error for missing teams', async () => {
		const response = await worker.fetch('/teams/does_not_exist');
		if (response) {
			const errorMsg = await response.json();

			expect(errorMsg).toEqual({message: 'Team not found'});
			expect(response.status).toEqual(404);
		}
	});
});