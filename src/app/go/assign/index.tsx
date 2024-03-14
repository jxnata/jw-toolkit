import { useSession } from 'contexts/Auth'
import { parse, useURL } from 'expo-linking'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { accept } from 'services/assignments/accept'
import { AcceptAssignmentReq } from 'types/api/assignments'
import { AcceptAssignmentQuery } from 'types/linking/accept-assignment'

import * as S from './styles'

const LaunchAcceptAssignment = () => {
	const { session } = useSession()
	const [error, setError] = useState(false)
	const url = useURL()
	const router = useRouter()

	const back = useCallback(async () => {
		router.replace('/')
	}, [router])

	const acceptAssignment = useCallback(
		async (data: AcceptAssignmentQuery) => {
			const body: AcceptAssignmentReq = {
				user: data.u,
				map: data.m,
				expiration: data.e,
				signature: data.s,
			}

			const result = await accept(body)

			if (!result) {
				setError(true)
				return
			}

			back()
		},
		[back]
	)

	useEffect(() => {
		if (!url) return
		if (!session) back()
		if (session.type === 'admin') back()

		const { queryParams } = parse(url)
		const link = queryParams as AcceptAssignmentQuery

		if (!link.m || !link.e || !link.u || !link.s) {
			setError(true)
			return
		}

		if (Number(link.e) < Date.now()) {
			setError(true)
			return
		}

		acceptAssignment(link)
	}, [acceptAssignment, back, session, url])

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
