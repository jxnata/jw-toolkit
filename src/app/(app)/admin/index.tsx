import { APP_VERSION } from 'constants/content'
import { useSession } from 'contexts/Auth'
import { Link, Stack, useRouter } from 'expo-router'
import useResume from 'hooks/swr/admin/useResume'
import { useCallback } from 'react'

import * as S from './styles'

const Admin = () => {
	const router = useRouter()
	const { session } = useSession()
	const { resume, mutate, loading } = useResume()

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

	return (
		<S.Container>
			<Stack.Screen options={{ title: session.data.congregation.name, headerRight: HeaderRight }} />
			<S.Content refreshControl={<S.RefreshControl onRefresh={mutate} refreshing={loading} />}>
				<Link href='/admin/publishers' asChild>
					<S.MenuItem>
						<S.Column>
							<S.Icon></S.Icon>
							<S.MenuTitle>Publicadores</S.MenuTitle>
						</S.Column>
						<S.Column>
							<S.MenuNumber>{resume.publishers || ''}</S.MenuNumber>
						</S.Column>
					</S.MenuItem>
				</Link>
				<Link href='/admin/maps' asChild>
					<S.MenuItem>
						<S.Column>
							<S.Icon></S.Icon>
							<S.MenuTitle>Mapas</S.MenuTitle>
						</S.Column>
						<S.Column>
							<S.MenuNumber>{resume.maps || ''}</S.MenuNumber>
						</S.Column>
					</S.MenuItem>
				</Link>
				<Link href='/admin/assignments' asChild>
					<S.MenuItem>
						<S.Column>
							<S.Icon></S.Icon>
							<S.MenuTitle>Designações</S.MenuTitle>
						</S.Column>
						<S.Column>
							<S.MenuNumber>{resume.assignments || ''}</S.MenuNumber>
						</S.Column>
					</S.MenuItem>
				</Link>
				<Link href='/admin/cities' asChild>
					<S.MenuItem>
						<S.Column>
							<S.Icon></S.Icon>
							<S.MenuTitle>Cidades</S.MenuTitle>
						</S.Column>
						<S.Column>
							<S.MenuNumber>{resume.cities || ''}</S.MenuNumber>
						</S.Column>
					</S.MenuItem>
				</Link>
				<Link href='/admin/users' asChild>
					<S.MenuItem>
						<S.Column>
							<S.Icon></S.Icon>
							<S.MenuTitle>Administradores</S.MenuTitle>
						</S.Column>
						<S.Column>
							<S.MenuNumber>{resume.users || ''}</S.MenuNumber>
						</S.Column>
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
