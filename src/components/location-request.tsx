import { PermissionStatus, requestForegroundPermissionsAsync } from 'expo-location'
import { Redirect } from 'expo-router'
import { useEffect, useState } from 'react'
import { Linking, Pressable, SafeAreaView, Text, View } from 'react-native'

const LocationRequest = () => {
	const [status, setStatus] = useState<PermissionStatus | null>(null)

	useEffect(() => {
		const checkPermissionStatus = async () => {
			const { status: newStatus } = await requestForegroundPermissionsAsync()
			setStatus(newStatus)
		}
		checkPermissionStatus()
	}, [status])

	if (status) {
		if (status === PermissionStatus.GRANTED) {
			return <Redirect href="/" />
		}
	}

	const requestLocationPermission = async () => {
		if (!status) return
		if (status === PermissionStatus.DENIED) {
			Linking.openSettings()
			return
		}

		requestForegroundPermissionsAsync()
	}

	return (
		<SafeAreaView className="flex h-full w-full bg-background">
			<View className="items-center p-2.5">
				<Text className="py-5 font-bold text-[17px] text-foreground">Localização</Text>
				<Text className="pb-5 font-medium text-[15px] text-foreground">
					É preciso permitir a leitura da sua localização para usar o aplicativo. Essa informação não é salva fora desse
					dispositivo.
				</Text>
				<Pressable
					onPress={requestLocationPermission}
					className="mb-[15px] flex w-full flex-row items-center justify-center gap-[5px] rounded-xl bg-primary-600 p-5 text-[15px]">
					<Text className="font-bold text-[15px] text-white">Continuar</Text>
				</Pressable>
			</View>
		</SafeAreaView>
	)
}

export default LocationRequest
