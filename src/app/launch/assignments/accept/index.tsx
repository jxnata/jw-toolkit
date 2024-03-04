import { useSession } from 'contexts/Auth'
import { parse, useURL } from 'expo-linking'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { accept } from 'services/assignments/accept'
import { AcceptAssignmentQuery } from 'types/linking/accept-assignment'
import * as S from './styles'

const LaunchAcceptAssignment = () => {
	const { session } = useSession()
	const [error, setError] = useState(false)
	const url = useURL()
	const router = useRouter()

	const acceptAssignment = async (data: AcceptAssignmentQuery) => {
		const result = await accept(data)

		if (!result) {
			setError(true)
			return
		}

		back()
	}

	const back = async () => {
		router.replace('/')
	}

	useEffect(() => {
		if (!url) return
		if (!session) back()
		if (session.type === 'admin') back()

		const { queryParams } = parse(url)
		const link = queryParams as AcceptAssignmentQuery

		if (!link.map || !link.expiration || !link.user || !link.signature) {
			setError(true)
			return
		}

		if (Number(link.expiration) < Date.now()) {
			setError(true)
			return
		}

		acceptAssignment(link)
	}, [url])

	return (
		<S.Container>
			<S.Content>
				{error ? <S.Error>Mapa inválido, expirado ou já designado</S.Error> : <S.Loading />}
				<S.Button onPress={back}>
					<S.ButtonTitle>Voltar</S.ButtonTitle>
				</S.Button>
			</S.Content>
		</S.Container>
	)
}

export default LaunchAcceptAssignment
