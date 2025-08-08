import 'dotenv/config'

export default ({ config }) => {
	const appConfig = { ...config }

	if (appConfig.android && appConfig.android.config && appConfig.android.config.googleMaps) {
		appConfig.android.config.googleMaps.apiKey = process.env.GOOGLE_MAPS_API_KEY
	}

	return appConfig
}
