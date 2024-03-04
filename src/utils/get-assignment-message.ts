export const getAssignmentMessage = (map: string, user: string, expiration: string) => {
	return `${map}-${user}-${expiration}`
}
