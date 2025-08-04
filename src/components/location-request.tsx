import { useThemedColors } from '@/hooks/use-themed-colors'
import { PermissionStatus, requestForegroundPermissionsAsync } from 'expo-location'
import { Redirect } from 'expo-router'
import { useEffect, useState } from 'react'
import { Linking, Pressable, SafeAreaView, Text, View } from 'react-native'

const LocationRequest = () => {
	const [status, setStatus] = useState<PermissionStatus | null>(null)
	const { colors } = useThemedColors()

	useEffect(() => {
		const checkPermissionStatus = async () => {
			const { status: newStatus } = await requestForegroundPermissionsAsync()
			setStatus(newStatus)
		}
		checkPermissionStatus()
	}, [status])

	if (status) {
		if (status === PermissionStatus.GRANTED) {
			return <Redirect href='/' />
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
		<SafeAreaView className='flex w-full h-full bg-background'>
			<View className='items-center p-2.5'>
				<Text className='text-[17px] text-foreground py-5 font-bold'>Localização</Text>
				<Text className='text-[15px] text-foreground pb-5 font-medium'>
					É preciso permitir a leitura da sua localização para usar o aplicativo. Essa informação não é salva
					fora desse dispositivo.
				</Text>
				<Pressable
					onPress={requestLocationPermission}
					className='gap-[5px] flex flex-row items-center justify-center w-full p-5 rounded-xl bg-primary-600 text-[15px] mb-[15px]'
				>
					<Text className='text-white text-[15px] font-bold'>Continuar</Text>
				</Pressable>
			</View>
		</SafeAreaView>
	)
}

export default LocationRequest
