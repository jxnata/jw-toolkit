import Purchases from 'react-native-purchases'

export const getOfferings = async () => {
	try {
		const offerings = await Purchases.getOfferings()
		if (offerings.current === null) return []

		return offerings.current.availablePackages
	} catch (error) {
		console.error('Error fetching offerings:', error)
		return []
	}
}

export async function checkSubscription() {
	try {
		const customerInfo = await Purchases.getCustomerInfo()
		const active = customerInfo.entitlements.active['pro']

		return active
	} catch {
		return null
	}
}

export const identifyUser = async (userId: string) => {
	try {
		if (!userId) return null

		const customerInfo = await Purchases.logIn(userId)

		return customerInfo
	} catch (error) {
		console.error('Error identifying user in RevenueCat:', error)
		return null
	}
}

export const logoutUser = async () => {
	try {
		await Purchases.logOut()
	} catch (error) {
		console.error('Error logging out user from RevenueCat:', error)
	}
}
