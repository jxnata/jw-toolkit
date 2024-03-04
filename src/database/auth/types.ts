export type AuthStorage = {
	token: string
	private_key?: string
	type: 'publisher' | 'admin'
	data: string
}
