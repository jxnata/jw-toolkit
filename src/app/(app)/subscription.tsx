import Button from '@/components/button'
import { Loading } from '@/components/loading'
import { useSubscription } from '@/hooks/use-subscription'
import { useThemedColors } from '@/hooks/use-themed-colors'
import { getOfferings } from '@/lib/revenuecat'
import { router, Stack } from 'expo-router'
import { ArrowRight, Bell, Check, ClipboardList, Gift, Map, Shield, Users } from 'lucide-react-native'
import { useEffect, useMemo, useState } from 'react'
import { Image, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Purchases, { PurchasesPackage } from 'react-native-purchases'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Subscription() {
	const { checkSubscription } = useSubscription()
	const { colors } = useThemedColors()

	const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | undefined>()
	const [isLoading, setIsLoading] = useState(false)
	const [packages, setPackages] = useState<PurchasesPackage[]>([])
	const [loadingPackages, setLoadingPackages] = useState(true)
	const insets = useSafeAreaInsets()

	useEffect(() => {
		const fetchOfferings = async () => {
			try {
				setLoadingPackages(true)
				const availablePackages = await getOfferings()
				setPackages(availablePackages)
				const defaultPackage = availablePackages.find((pkg) => pkg.packageType === 'MONTHLY')
				if (defaultPackage) {
					setSelectedPackage(defaultPackage)
				}
			} catch (error) {
				console.log('Error fetching offerings:', error)
			} finally {
				setLoadingPackages(false)
			}
		}

		fetchOfferings()
	}, [])

	const handleSubscribe = async () => {
		try {
			setIsLoading(true)

			if (!selectedPackage) return

			const { customerInfo } = await Purchases.purchasePackage(selectedPackage)

			if (customerInfo.entitlements.active['pro']) {
				checkSubscription()
			}

			router.back()
		} catch (error: any) {
			if (error.userCancelled) {
				console.log('User cancelled the purchase')
			} else {
				console.log('Error subscribing:', error)
			}
		} finally {
			setIsLoading(false)
		}
	}

	const handleRestorePurchases = async () => {
		try {
			setIsLoading(true)

			const customerInfo = await Purchases.restorePurchases()

			if (customerInfo.entitlements.active['pro']) {
				checkSubscription()
			}

			router.back()
		} catch (error) {
			console.log('Error restoring purchases:', error)
		} finally {
			setIsLoading(false)
		}
	}

	const monthlyPackage = useMemo(() => packages.find((pkg) => pkg.packageType === 'MONTHLY'), [packages])

	const getPackageTypeText = (packageType: string) => {
		switch (packageType) {
			case 'MONTHLY':
				return 'Mensal'
			case 'ANNUAL':
				return 'Anual'
			default:
				return packageType
		}
	}

	const getFreeTrialText = (packageType: string) => {
		switch (packageType) {
			case 'MONTHLY':
				return '1 mês grátis'
			case 'ANNUAL':
				return '1 mês grátis'
			default:
				return 'Teste grátis'
		}
	}

	return (
		<View className="flex-1 bg-background">
			<Stack.Screen options={{ title: 'Assinatura' }} />
			<View className="flex-1" style={{ paddingBottom: insets.bottom + 12 }}>
				<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
					<View className="items-center px-4">
						<Image source={require('../../assets/icon.png')} className="h-16 w-16 rounded-xl" />
						<Text className="px-4 pt-3 text-center font-bold text-2xl text-foreground">Versão Pro - Sem Limitações</Text>
						<View className="mt-4 px-6">
							<View className="mb-2 flex-row items-center">
								<Users size={18} color={colors.primary[500]} />
								<Text className="ml-3 font-regular text-base text-foreground">Publicadores ilimitados por congregação</Text>
							</View>
							<View className="mb-2 flex-row items-center">
								<Map size={18} color={colors.primary[500]} />
								<Text className="ml-3 font-regular text-base text-foreground">Mapas ilimitados por congregação</Text>
							</View>
							<View className="mb-2 flex-row items-center">
								<Bell size={18} color={colors.primary[500]} />
								<Text className="ml-3 font-regular text-base text-foreground">Notificações em tempo real</Text>
							</View>
							<View className="mb-2 flex-row items-center">
								<ClipboardList size={18} color={colors.primary[500]} />
								<Text className="ml-3 font-regular text-base text-foreground">Exportação de mapas em PDF</Text>
							</View>
						</View>
					</View>

					{loadingPackages ? (
						<View className="items-center justify-center py-8">
							<Loading />
							<Text className="text-secondary-300 mt-4 text-center font-regular text-base">Carregando pacotes...</Text>
						</View>
					) : (
						<View className="my-4 w-full gap-2 px-4">
							{packages.map((pkg) => (
								<TouchableOpacity
									key={pkg.identifier}
									className={`w-full rounded-xl border-2 px-4 py-2 ${
										selectedPackage && selectedPackage.identifier === pkg.identifier
											? 'border-primary bg-card'
											: 'border-border'
									}`}
									onPress={() => setSelectedPackage(pkg)}
									activeOpacity={0.8}
									disabled={isLoading}>
									{selectedPackage && selectedPackage.identifier === pkg.identifier && (
										<View className="absolute right-1 top-1 rounded-full bg-primary p-1">
											<Check size={10} color="#FFFFFF" />
										</View>
									)}
									<View className="mb-1 flex-row items-center gap-2">
										<Text className="font-semibold text-lg text-foreground opacity-80">
											{getPackageTypeText(pkg.packageType)}
										</Text>
										{pkg.packageType === 'ANNUAL' && monthlyPackage && monthlyPackage.product.pricePerYear && (
											<View className="flex-row items-center gap-1 rounded-full bg-success-500 px-2 py-1">
												<Gift size={12} color="#FFFFFF" />
												<Text className="font-bold text-xs text-white">
													Economize{' '}
													{Math.round(
														((monthlyPackage.product.pricePerYear - pkg.product.price) /
															monthlyPackage.product.pricePerYear) *
															100
													)}
													%
												</Text>
											</View>
										)}
									</View>
									{pkg.product.introPrice ? (
										<View key={pkg.identifier}>
											<View className="flex-row items-baseline gap-2">
												<Text className="font-bold text-sm text-primary">{getFreeTrialText(pkg.packageType)}</Text>
											</View>
											<Text className="font-semibold text-sm text-foreground">
												{pkg.product.priceString} {getPackageTypeText(pkg.packageType).toLowerCase()}
											</Text>
										</View>
									) : (
										<View className="flex-row items-baseline gap-1">
											{pkg.packageType === 'ANNUAL' && monthlyPackage && (
												<Text className="font-bold text-base text-foreground line-through opacity-50">
													{monthlyPackage.product.pricePerYearString}
												</Text>
											)}
											<Text className="text-secondary font-bold text-lg">{pkg.product.priceString}</Text>
										</View>
									)}
								</TouchableOpacity>
							))}
						</View>
					)}

					<View className="mb-6 flex-row items-center gap-2 px-6">
						<Shield size={16} color={colors.success[500]} />
						<Text className="mt-1 font-regular text-sm text-foreground">Cancele a qualquer momento</Text>
					</View>
				</ScrollView>

				<View className="border-t border-border px-6 pt-4">
					<Button
						onPress={handleSubscribe}
						className="mb-3 w-full"
						loading={isLoading}
						disabled={!selectedPackage}
						right={<ArrowRight size={16} color="#FFFFFF" />}>
						{selectedPackage && selectedPackage.product.introPrice ? 'Teste grátis' : 'Continuar'}
					</Button>
					<Button onPress={handleRestorePurchases} className="w-full" variant="link" loading={isLoading}>
						Restaurar compras
					</Button>
					<View className="mt-2 flex-row items-center justify-between">
						<Text
							className="text-primary underline"
							onPress={() => Linking.openURL('https://jxnata.notion.site/Terms-Conditions-247091336ffe80ac8900c72cc4d20edc')}>
							Termos e condições
						</Text>
						<Text
							className="text-primary underline"
							onPress={() => Linking.openURL('https://jxnata.notion.site/Privacy-Policy-247091336ffe805ea4d8d5436cb486ee')}>
							Política de privacidade
						</Text>
					</View>
				</View>
			</View>
		</View>
	)
}
