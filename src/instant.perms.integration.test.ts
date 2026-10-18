/**
 * Security tests for src/instant.perms.ts against a real InstantDB TEST app — never point these at production.
 * Push the schema and perms to the test app first, then run with: bun run test:integration
 *
 * Legitimate flows go through the app services (impersonating each user); attacks use raw transactions.
 */
import 'dotenv/config'
import { congregationsService } from '@/services/instantdb/congregations-service'
import { mapsService } from '@/services/instantdb/maps-service'
import { publishersService } from '@/services/instantdb/publishers-service'
import {
	AdminDb,
	createTestUser,
	deleteCongregations,
	deleteTestUsers,
	initTestDb,
	PERMISSION_DENIED,
	runId,
} from '@/test-utils/instant-integration'
import { id } from '@instantdb/admin'

jest.mock('@instantdb/react-native', () => {
	const admin = jest.requireActual('@instantdb/admin')
	return { id: admin.id, i: admin.i }
})

// Points to whichever impersonated client the current step is acting as
const mockDbRef: { current: any } = { current: null }

jest.mock('@/lib/db', () => ({
	__esModule: true,
	default: {
		queryOnce: async (query: unknown) => ({ data: await mockDbRef.current.query(query) }),
		transact: (chunks: unknown) => mockDbRef.current.transact(chunks),
		get tx() {
			return mockDbRef.current.tx
		},
	},
}))

type Actor = 'ana' | 'bruno' | 'carla' | 'davi' | 'eva' | 'gil'

const run = runId()
const emailOf = (actor: Actor) => `perms-${actor}-${run}@integration.test`
const ACTORS: Actor[] = ['ana', 'bruno', 'carla', 'davi', 'eva', 'gil']

let db: AdminDb
const userIds = {} as Record<Actor, string>
const publisherIds = {} as Partial<Record<Actor, string>>
const congregationIds: string[] = []
let congA: string // created and administered by Ana
let congB: string // created and administered by Eva
let cityA: string
let cityB: string
let mapA: string // assigned to Bruno

// Acts as the given user (or a guest) for both raw transactions and app services
function as(actor: Actor | 'guest') {
	const scoped = actor === 'guest' ? db.asUser({ guest: true }) : db.asUser({ email: emailOf(actor) })
	mockDbRef.current = scoped
	return scoped
}

async function visibleCount(actor: Actor | 'guest', query: Record<string, unknown>): Promise<number> {
	const scoped: any = as(actor)
	const data = (await scoped.query(query)) as Record<string, unknown[]>
	return Object.values(data)[0].length
}

async function publisherOf(actor: Actor) {
	const { publishers } = await db.query({ publishers: { $: { where: { user: userIds[actor] } }, congregation: {} } })
	return publishers[0]
}

// What the session provider does on first login
async function signIn(actor: Actor) {
	as(actor)
	publisherIds[actor] = await publishersService.createPublisher({
		userId: userIds[actor],
		name: actor,
		level: 3,
		approved: false,
	})
}

// What select-congregation does
async function join(actor: Actor, congregationId: string) {
	as(actor)
	const isCreator = await congregationsService.isCreator(congregationId, userIds[actor])
	await publishersService.joinCongregation(publisherIds[actor]!, congregationId, isCreator)
}

async function createCongregation(actor: Actor, name: string) {
	as(actor)
	const congId = await congregationsService.createCongregation({ name, enabled: true, creatorId: userIds[actor] })
	congregationIds.push(congId)
	return congId
}

beforeAll(async () => {
	db = initTestDb()
	for (const actor of ACTORS) userIds[actor] = await createTestUser(db, emailOf(actor))
	// Gil never signs in to the app, so he has no publisher yet
	for (const actor of ACTORS.filter((a) => a !== 'gil')) await signIn(actor)
})

afterAll(async () => {
	if (!db) return
	await deleteCongregations(db, congregationIds)
	await deleteTestUsers(db, ACTORS.map(emailOf))
})

// ── legitimate flows ─────────────────────────────────────────────────────────

describe('legitimate flows', () => {
	it('creator creates a congregation and becomes its admin', async () => {
		congA = await createCongregation('ana', `[perms] A ${run}`)
		await join('ana', congA)
		expect(await publisherOf('ana')).toMatchObject({ level: 1, approved: true, congregation: { id: congA } })

		congB = await createCongregation('eva', `[perms] B ${run}`)
		await join('eva', congB)
		expect(await publisherOf('eva')).toMatchObject({ level: 1, approved: true })
	})

	it('other users join as pending publishers and the admin approves them', async () => {
		await join('bruno', congA)
		await join('carla', congA)
		expect(await publisherOf('bruno')).toMatchObject({ level: 3, approved: false, congregation: { id: congA } })

		as('ana')
		await publishersService.updatePublisher(publisherIds.bruno!, { approved: true })
		expect(await publisherOf('bruno')).toMatchObject({ approved: true })
	})

	it('admin manages cities, districts and maps and assigns a map', async () => {
		cityA = id()
		as('ana')
		await db.asUser({ email: emailOf('ana') }).transact([
			db.tx.cities[cityA].update({ name: 'Cidade A' }).link({ congregation: congA }),
			db.tx.districts[id()].update({ name: 'Centro' }).link({ city: cityA }),
		])
		mapA = await mapsService.createMap({
			name: 'Mapa A',
			address: 'Rua A, 1',
			lat: 1,
			lng: 1,
			cityId: cityA,
			congregationId: congA,
		})
		await mapsService.assignMap(mapA, publisherIds.bruno!)

		cityB = id()
		await as('eva').transact(db.tx.cities[cityB].update({ name: 'Cidade B' }).link({ congregation: congB }))

		const { maps } = await db.query({ maps: { $: { where: { id: mapA } }, assigned: {} } })
		expect(maps[0].assigned?.id).toBe(publisherIds.bruno)
	})

	it('approved member sees the congregation territory and publishers', async () => {
		expect(await visibleCount('bruno', { maps: { $: { where: { congregation: congA } } } })).toBe(1)
		expect(await visibleCount('bruno', { cities: { $: { where: { congregation: congA } } } })).toBe(1)
		expect(await visibleCount('bruno', { districts: { $: { where: { 'city.congregation': congA } } } })).toBe(1)
		expect(await visibleCount('bruno', { publishers: { $: { where: { congregation: congA } } } })).toBe(3)
	})

	it('admin sees the e-mail of publishers in the congregation', async () => {
		expect(await visibleCount('ana', { $users: { $: { where: { id: userIds.bruno } } } })).toBe(1)
	})

	it('assigned publisher records the visit and finishes the assignment', async () => {
		as('bruno')
		await mapsService.updateMap(mapA, {
			found: true,
			found_info: 'Atendeu',
			visited: new Date().toISOString(),
			visited_by: 'Bruno',
		})
		await mapsService.unassignMap(mapA, publisherIds.bruno!)

		const { maps } = await db.query({ maps: { $: { where: { id: mapA } }, assigned: {} } })
		expect(maps[0]).toMatchObject({ found: true, found_info: 'Atendeu' })
		expect(maps[0].assigned).toBeFalsy()

		as('ana')
		await mapsService.assignMap(mapA, publisherIds.bruno!)
	})

	it('admin updates the congregation', async () => {
		as('ana')
		await congregationsService.updateCongregation(congA, { name: `[perms] A ${run} renamed` })
	})

	it('admin rejects a pending request', async () => {
		as('ana')
		await publishersService.updatePublisher(publisherIds.carla!, { approved: false })
		await publishersService.unlinkCongregation(publisherIds.carla!, congA)
		expect((await publisherOf('carla')).congregation).toBeFalsy()

		await join('carla', congA) // back to pending for the attack tests
	})

	it('an admin who joins another congregation becomes a pending publisher there', async () => {
		await join('eva', congA)
		expect(await publisherOf('eva')).toMatchObject({ level: 3, approved: false, congregation: { id: congA } })

		await join('eva', congB) // creator of B, so admin again
		expect(await publisherOf('eva')).toMatchObject({ level: 1, approved: true, congregation: { id: congB } })
	})
})

// ── attacks ──────────────────────────────────────────────────────────────────

describe('attacks', () => {
	describe('anonymous visitor', () => {
		it('cannot list users or publishers', async () => {
			expect(await visibleCount('guest', { $users: { $: { where: { id: { $in: Object.values(userIds) } } } } })).toBe(
				0
			)
			expect(await visibleCount('guest', { publishers: { $: { where: { congregation: congA } } } })).toBe(0)
		})

		it('cannot create a publisher', async () => {
			await expect(
				as('guest').transact(db.tx.publishers[id()].update({ name: 'x', level: 3 }).link({ user: userIds.gil }))
			).rejects.toThrow(PERMISSION_DENIED)
		})
	})

	describe('signed-in stranger', () => {
		it('cannot create an admin publisher inside a congregation', async () => {
			await expect(
				as('gil').transact(
					db.tx.publishers[id()]
						.update({ name: 'x', level: 1, approved: true })
						.link({ user: userIds.gil, congregation: congA })
				)
			).rejects.toThrow(PERMISSION_DENIED)
		})

		it('cannot create a publisher for another user', async () => {
			await expect(
				as('davi').transact(db.tx.publishers[id()].update({ name: 'x', level: 3 }).link({ user: userIds.gil }))
			).rejects.toThrow(PERMISSION_DENIED)
		})

		it('cannot see users, publishers or territory of a congregation', async () => {
			expect(await visibleCount('davi', { $users: { $: { where: { id: userIds.bruno } } } })).toBe(0)
			expect(await visibleCount('davi', { publishers: { $: { where: { congregation: congA } } } })).toBe(0)
			expect(await visibleCount('davi', { maps: { $: { where: { congregation: congA } } } })).toBe(0)
		})

		it('cannot claim to be the creator of an existing congregation', async () => {
			await expect(as('davi').transact(db.tx.congregations[congA].link({ creator: userIds.davi }))).rejects.toThrow(
				PERMISSION_DENIED
			)
			await expect(
				as('davi').transact(db.tx.$users[userIds.davi].link({ created_congregations: congA }))
			).rejects.toThrow(PERMISSION_DENIED)
		})

		it('cannot create a congregation on behalf of someone else, or without a creator', async () => {
			await expect(
				as('davi').transact(db.tx.congregations[id()].update({ name: 'x' }).link({ creator: userIds.ana }))
			).rejects.toThrow(PERMISSION_DENIED)
			await expect(as('davi').transact(db.tx.congregations[id()].update({ name: 'x' }))).rejects.toThrow(
				PERMISSION_DENIED
			)
		})

		it('cannot take over the publisher record of another user', async () => {
			await expect(
				as('davi').transact(db.tx.publishers[publisherIds.bruno!].link({ user: userIds.davi }))
			).rejects.toThrow(PERMISSION_DENIED)
			await expect(
				as('davi').transact(db.tx.$users[userIds.davi].link({ publisher: publisherIds.bruno! }))
			).rejects.toThrow(PERMISSION_DENIED)
		})

		it('is rate limited when creating congregations', async () => {
			// Gil is used here because every evaluation of the rule (even a denied one) consumes tokens
			const attempt = () => createCongregation('gil', `[perms] spam ${run}`)
			await attempt()
			await attempt()
			await attempt()
			await expect(attempt()).rejects.toThrow(PERMISSION_DENIED)
		})
	})

	describe('pending publisher', () => {
		it('cannot see the territory or the publishers before approval', async () => {
			expect(await visibleCount('carla', { maps: { $: { where: { congregation: congA } } } })).toBe(0)
			expect(await visibleCount('carla', { cities: { $: { where: { congregation: congA } } } })).toBe(0)
			expect(await visibleCount('carla', { publishers: { $: { where: { congregation: congA } } } })).toBe(1) // self
		})

		it('cannot approve or promote themselves', async () => {
			await expect(
				as('carla').transact(db.tx.publishers[publisherIds.carla!].update({ approved: true }))
			).rejects.toThrow(PERMISSION_DENIED)
			await expect(as('carla').transact(db.tx.publishers[publisherIds.carla!].update({ level: 1 }))).rejects.toThrow(
				PERMISSION_DENIED
			)
		})
	})

	describe('approved publisher', () => {
		it('cannot promote themselves to admin', async () => {
			await expect(as('bruno').transact(db.tx.publishers[publisherIds.bruno!].update({ level: 1 }))).rejects.toThrow(
				PERMISSION_DENIED
			)
		})

		it('cannot approve someone else', async () => {
			await expect(
				as('bruno').transact(db.tx.publishers[publisherIds.carla!].update({ approved: true }))
			).rejects.toThrow(PERMISSION_DENIED)
		})

		it('cannot edit the assigned map beyond the visit fields', async () => {
			await expect(as('bruno').transact(db.tx.maps[mapA].update({ address: 'changed' }))).rejects.toThrow(
				PERMISSION_DENIED
			)
		})

		it('cannot move the assigned map to another congregation or city', async () => {
			await expect(as('bruno').transact(db.tx.maps[mapA].link({ congregation: congB }))).rejects.toThrow(
				PERMISSION_DENIED
			)
			await expect(as('bruno').transact(db.tx.maps[mapA].link({ city: cityB }))).rejects.toThrow(PERMISSION_DENIED)
		})

		it('cannot reassign the map to someone else', async () => {
			await expect(
				as('bruno').transact(db.tx.maps[mapA].link({ assigned: publisherIds.carla! }))
			).rejects.toThrow(PERMISSION_DENIED)
		})

		it('cannot create or delete territory', async () => {
			await expect(
				as('bruno').transact(db.tx.cities[id()].update({ name: 'x' }).link({ congregation: congA }))
			).rejects.toThrow(PERMISSION_DENIED)
			await expect(as('bruno').transact(db.tx.maps[mapA].delete())).rejects.toThrow(PERMISSION_DENIED)
		})
	})

	describe('admin of another congregation', () => {
		it('cannot see the other congregation territory', async () => {
			expect(await visibleCount('eva', { maps: { $: { where: { congregation: congA } } } })).toBe(0)
		})

		it('cannot change publishers of the other congregation', async () => {
			await expect(
				as('eva').transact(db.tx.publishers[publisherIds.carla!].update({ approved: true }))
			).rejects.toThrow(PERMISSION_DENIED)
			await expect(as('eva').transact(db.tx.publishers[publisherIds.bruno!].delete())).rejects.toThrow(
				PERMISSION_DENIED
			)
		})

		it('cannot move territory between congregations', async () => {
			await expect(as('eva').transact(db.tx.maps[mapA].link({ congregation: congB }))).rejects.toThrow(
				PERMISSION_DENIED
			)
			await expect(as('eva').transact(db.tx.cities[cityA].link({ congregation: congB }))).rejects.toThrow(
				PERMISSION_DENIED
			)
			await expect(as('eva').transact(db.tx.congregations[congB].link({ cities: cityA }))).rejects.toThrow(
				PERMISSION_DENIED
			)
		})

		it('cannot plant data inside the other congregation', async () => {
			await expect(
				as('eva').transact(
					db.tx.maps[id()].update({ name: 'x', address: 'x', lat: 0, lng: 0 }).link({ congregation: congB, city: cityA })
				)
			).rejects.toThrow(PERMISSION_DENIED)
			await expect(
				as('eva').transact(db.tx.districts[id()].update({ name: 'x' }).link({ city: cityA }))
			).rejects.toThrow(PERMISSION_DENIED)
		})
	})

	it('nobody can read subscriptions from the client', async () => {
		expect(await visibleCount('ana', { subscriptions: {} })).toBe(0)
	})
})
