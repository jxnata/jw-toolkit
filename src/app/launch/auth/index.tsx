import { AuthRequest, useSession } from 'contexts/Auth'
import { parse, useURL } from 'expo-linking'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { SubmitHandler } from 'react-hook-form'
import { AuthQuery } from 'types/linking/auth'
import * as S from './styles'

const LaunchAuth = () => {
	const url = useURL()

	const router = useRouter()
	const { signIn } = useSession()

	const auth: SubmitHandler<AuthRequest> = async data => {
		const authorized = await signIn(data)

		if (!authorized) return alert('Usuário ou senha inválidos')

		router.replace(`/${data.type}`)
	}

	useEffect(() => {
		if (!url) return

		const { queryParams } = parse(url)
		const link = queryParams as AuthQuery

		if (!link.type || !link.user || !link.pass) {
			router.replace(`/sign-in`)
			return
		}

		auth(link)
	}, [url])

	return (
		<S.Container>
			<S.Loading />
		</S.Container>
	)
}

export default LaunchAuth
