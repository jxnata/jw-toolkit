import { IMapAddress } from 'types/models/Map'

export const getAddressString = (address: IMapAddress) => {
	return `${address.street}, ${address.number}, ${address.district} - ${address.city}`
}
