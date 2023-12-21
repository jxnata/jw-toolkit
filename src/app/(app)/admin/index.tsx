import { useSession } from 'contexts/Auth'
import { Link, Stack, useRouter } from 'expo-router'
import useResume from 'hooks/swr/admin/useResume'
import { useCallback } from 'react'
import * as S from './styles'

const Admin = () => {
	const router = useRouter()
	const { session } = useSession()
	const { resume } = useResume()

	const HeaderRight = useCallback(
		() => (
			<S.HeaderContainer>
				{/* <S.IconButton onPress={() => router.push('/publisher/history')}>
					<S.Icon name='file-tray-full-outline' />
				</S.IconButton> */}
				<S.IconButton onPress={() => router.push('/admin/me')}>
					<S.Ionicon name='person-circle-outline' />
				</S.IconButton>
			</S.HeaderContainer>
		),
		[]
	)

	return (
		<S.Container>
			<Stack.Screen options={{ title: session.data.congregation.name, headerRight: HeaderRight }} />
			<S.Content>
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
				<S.MenuItem>
					<S.Column>
						<S.Icon></S.Icon>
						<S.MenuTitle>Designações</S.MenuTitle>
					</S.Column>
					<S.Column>
						<S.MenuNumber>{resume.assignments || ''}</S.MenuNumber>
					</S.Column>
				</S.MenuItem>
				<S.MenuItem>
					<S.Column>
						<S.Icon></S.Icon>
						<S.MenuTitle>Cidades</S.MenuTitle>
					</S.Column>
					<S.Column>
						<S.MenuNumber>{resume.cities || ''}</S.MenuNumber>
					</S.Column>
				</S.MenuItem>
			</S.Content>
		</S.Container>
	)
}

export default Admin
