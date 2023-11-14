import { IPublisher } from "types/models/Publisher"
import { IUser } from "types/models/User"
import { AuthRequest } from "utils/publisher-auth"

export type IAuthContext = {
    signIn: (_: AuthRequest) => Promise<boolean>
    signOut: () => void
    session: ISession
    loading: boolean
}

export type ISession = {
    token: string
    type: 'publisher' | 'admin'
    data: IUser | IPublisher
}