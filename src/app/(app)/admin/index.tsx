import { APP_VERSION } from '@constants/content'
import { useSession } from '@contexts/session'
import { Link, Stack, useRouter } from 'expo-router'
import { useCallback } from 'react'

import * as S from './styles'

const Admin = () => {
	const router = useRouter()
	const { congregation } = useSession()

	const HeaderRight = useCallback(
		() => (
			<S.HeaderContainer>
				<S.IconButton onPress={() => router.push('/admin/me')}>
					<S.Ionicon name='person-circle-outline' />
				</S.IconButton>
			</S.HeaderContainer>
		),
		[router]
	)

	if (!congregation) return null

	return (
		<S.Container>
			<Stack.Screen options={{ title: congregation.name, headerRight: HeaderRight }} />
			<S.Content>
				<Link href='/admin/publishers' asChild>
					<S.MenuItem>
						<S.Column>
							<S.Icon></S.Icon>
							<S.MenuTitle>Publicadores</S.MenuTitle>
						</S.Column>
						<S.Column></S.Column>
					</S.MenuItem>
				</Link>
				<Link href='/admin/maps' asChild>
					<S.MenuItem>
						<S.Column>
							<S.Icon></S.Icon>
							<S.MenuTitle>Mapas</S.MenuTitle>
						</S.Column>
						<S.Column></S.Column>
					</S.MenuItem>
				</Link>
				<Link href='/admin/assignments' asChild>
					<S.MenuItem>
						<S.Column>
							<S.Icon></S.Icon>
							<S.MenuTitle>Designações</S.MenuTitle>
						</S.Column>
						<S.Column></S.Column>
					</S.MenuItem>
				</Link>
				<Link href='/admin/cities' asChild>
					<S.MenuItem>
						<S.Column>
							<S.Icon></S.Icon>
							<S.MenuTitle>Cidades</S.MenuTitle>
						</S.Column>
						<S.Column></S.Column>
					</S.MenuItem>
				</Link>
				<Link href='/admin/export' asChild>
					<S.MenuItem>
						<S.Column>
							<S.Icon></S.Icon>
							<S.MenuTitle>Exportar mapas</S.MenuTitle>
						</S.Column>
					</S.MenuItem>
				</Link>
			</S.Content>
			<S.Version>Versão: {APP_VERSION}</S.Version>
		</S.Container>
	)
}

export default Admin
