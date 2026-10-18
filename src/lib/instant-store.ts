import { instant } from '@/database/index'
import { StoreInterface, type StoreInterfaceStoreName } from '@instantdb/react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Same key layout as the default InstantDB store, so the data moved from AsyncStorage stays readable
const version = 5

/**
 * InstantDB local cache backed by MMKV.
 *
 * The default store persists to AsyncStorage, which on Android is a SQLite database capped at 6 MB.
 * Large congregations exceed that cap and every write fails with SQLITE_FULL.
 */
export default class InstantStore extends StoreInterface {
	private prefix: string
	private migration: Promise<void> | null = null

	constructor(appId: string, storeName: StoreInterfaceStoreName) {
		super(appId, storeName)
		this.prefix = `instant_${appId}_${version}_${storeName}_`
	}

	private makeKey(k: string) {
		return `${this.prefix}${k}`
	}

	// Moves what the default store left in AsyncStorage (session, pending mutations, query cache)
	// into MMKV once, and frees the space there.
	private migrate() {
		if (!this.migration) this.migration = this.runMigration()
		return this.migration
	}

	private async runMigration() {
		const migratedKey = this.makeKey('__migrated')
		if (instant.contains(migratedKey)) return

		try {
			const legacyKeys = (await AsyncStorage.getAllKeys()).filter((key) => key.startsWith(this.prefix))

			// One key at a time: a single oversized row must not block the others
			for (const key of legacyKeys) {
				if (instant.contains(key)) continue
				try {
					const value = await AsyncStorage.getItem(key)
					if (value !== null) instant.set(key, value)
				} catch {
					// Unreadable entry, it will be fetched again from the server
				}
			}

			instant.set(migratedKey, true)
			await AsyncStorage.multiRemove(legacyKeys).catch(() => {})
		} catch {
			// AsyncStorage unavailable, try again on the next launch
		}
	}

	async getItem(k: string) {
		await this.migrate()
		const res = instant.getString(this.makeKey(k))
		if (res === undefined) return null
		return JSON.parse(res)
	}

	async removeItem(k: string) {
		await this.migrate()
		instant.remove(this.makeKey(k))
	}

	async multiSet(keyValuePairs: [string, any][]) {
		await this.migrate()
		for (const [k, v] of keyValuePairs) {
			instant.set(this.makeKey(k), JSON.stringify(v))
		}
	}

	async getAllKeys() {
		await this.migrate()
		return instant
			.getAllKeys()
			.filter((key) => key.startsWith(this.prefix) && key !== this.makeKey('__migrated'))
			.map((key) => key.substring(this.prefix.length))
	}
}
