import type { Permission } from '@directus/types';
import { beforeEach, expect, test, vi } from 'vitest';
import type { PermissionsService } from '../../services/permissions/index.js';
import { fetchPermissions } from './fetch-permissions.js';

let service: PermissionsService;

beforeEach(() => {
	service = {
		readByQuery: vi.fn(),
	} as unknown as PermissionsService;
});

test('Returns permissions read through service', async () => {
	const permissions: Permission[] = [];
	const policies = [] as string[];
	const collections = [] as string[];

	vi.mocked(service.readByQuery).mockResolvedValue(permissions);

	const res = await fetchPermissions(service, 'read', policies, collections);

	expect(res).toBe(permissions);

	expect(service.readByQuery).toHaveBeenCalledWith({
		filter: {
			_and: [{ policy: { _in: policies } }, { action: { _eq: 'read' } }, { collection: { _in: collections } }],
		},
		limit: -1,
	});
});

test('Fetches for all collections when collections filter is undefined', async () => {
	const permissions: Permission[] = [];
	const policies = [] as string[];
	const collections = undefined;

	vi.mocked(service.readByQuery).mockResolvedValue(permissions);

	const res = await fetchPermissions(service, 'read', policies, collections);

	expect(res).toBe(permissions);

	expect(service.readByQuery).toHaveBeenCalledWith({
		filter: {
			_and: [{ policy: { _in: policies } }, { action: { _eq: 'read' } }],
		},
		limit: -1,
	});
});