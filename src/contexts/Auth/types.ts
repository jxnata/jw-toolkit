export type AuthRequest = {
	user: string
	pass: string
	congregation?: string
	type: 'publisher' | 'admin'
}
export interface ISession<T> {
	token: string
	private_key?: string
	type: 'publisher' | 'admin'
	data: T
}

export type IAuthContext<T> = {
	signIn: (_: AuthRequest) => Promise<boolean>
	signOut: () => void
	swap: () => Promise<boolean>
	session: ISession<T>
	loading: boolean
}
