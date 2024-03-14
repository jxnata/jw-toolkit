import Button from 'components/Button'
import IconButton from 'components/IconButton'
import Input from 'components/Input'
import { DEFAULT_PRIVILEGES } from 'constants/content'
import { JW_TOOLKIT_API } from 'constants/urls'
import { useSession } from 'contexts/Auth'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import usePublisher from 'hooks/swr/admin/usePublisher'
import usePublishers from 'hooks/swr/admin/usePublishers'
import useCheckbox from 'hooks/useCheckbox'
import compact from 'lodash/compact'
import split from 'lodash/split'
import { error as removeError, success as removeSuccess } from 'messages/delete'
import { error, success } from 'messages/edit'
import { error as resetError, success as resetSuccess } from 'messages/reset'
import { error as vinculateError, success as vinculateSuccess } from 'messages/vinculate'
import { useCallback, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Alert, Share } from 'react-native'
import { edit } from 'services/publishers/edit'
import { remove } from 'services/publishers/remove'
import { reset } from 'services/publishers/reset'
import { vinculate } from 'services/user/vinculate'
import { colors } from 'themes'
import { EditPublisherReq, ResetPublisherRes } from 'types/api/publishers'
import { IPublisherParams } from 'types/models/Publisher'
import { IUser } from 'types/models/User'

import * as S from './styles'

const EditPublisher = () => {
	const { session } = useSession<IUser>()
	const params: Partial<IPublisherParams> = useLocalSearchParams()
	const { publisher, mutate: mutatePublisher } = usePublisher(params._id)
	const { mutate } = usePublishers({ all: true, search: '' })
	const [publisherData, setPublisherData] = useState<ResetPublisherRes>()
	const { control, formState, handleSubmit } = useForm<EditPublisherReq>({
		defaultValues: { name: params.name, privileges: split(params.privileges, ',') },
	})

	const { CheckboxComponent } = useCheckbox(DEFAULT_PRIVILEGES, split(params.privileges, ','))

	const save: SubmitHandler<EditPublisherReq> = async data => {
		const result = await edit(params._id, { ...data, privileges: compact(data.privileges || []) })

		if (result) {
			success('publicador')
			mutate()
			mutatePublisher()
			return
		}

		error('publicador')
	}

	const resetPassword = async () => {
		const result = await reset(params._id)

		if (result) {
			resetSuccess('publicador')
			setPublisherData({ publisher: publisher.name, passcode: result.passcode })
			mutate()
			return
		}

		resetError('publicador')
	}

	const deletePublisher = async () => {
		const result = await remove(params._id)

		if (result) {
			removeSuccess('publicador')
			mutate()
			router.back()
			return
		}

		removeError('publicador')
	}

	const vinculateUser = async () => {
		const result = await vinculate(params._id)

		if (result) {
			vinculateSuccess()
			router.back()
			return
		}

		vinculateError()
	}

	const sharePublisher = useCallback(async () => {
		await Share.share({
			message: `Seu login no JW Maps\n\nUsuário: ${publisherData.publisher}\nSenha: ${publisherData.passcode}\n\nLink para entrar:\n${JW_TOOLKIT_API}/go/auth?type=publisher&user=${publisherData.publisher}&pass=${publisherData.passcode}`,
		})
	}, [publisherData])

	const showResetAlert = () =>
		Alert.alert(
			'Resetar',
			'Deseja criar uma nova senha para o publicador? A senha antiga será deletada e ele precisará fazer login novamente.',
			[
				{
					text: 'Cancelar',
					style: 'cancel',
				},
				{
					text: 'Sim',
					onPress: () => resetPassword(),
					style: 'default',
				},
			]
		)

	const showDeleteAlert = () =>
		Alert.alert(
			'Excluir',
			'Deseja excluir o publicador e todas as suas designações? Essa opção não pode ser revertida.',
			[
				{
					text: 'Cancelar',
					style: 'cancel',
				},
				{
					text: 'Sim, excluir',
					onPress: () => deletePublisher(),
					style: 'default',
				},
			]
		)

	const showVinculateAlert = () =>
		Alert.alert(
			'Vincular',
			'Deseja vincular o publicador para seu usuário? Depois de vincular, faça login novamente como admin.',
			[
				{
					text: 'Cancelar',
					style: 'cancel',
				},
				{
					text: 'Sim, excluir',
					onPress: () => vinculateUser(),
					style: 'default',
				},
			]
		)

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Editar Publicador' }} />
			<S.Content>
				{!!publisherData && (
					<S.DataContainer onPress={sharePublisher}>
						<S.ShareIcon name='share-outline' />
						<S.Row>
							<S.Label>Nome: </S.Label>
							<S.Paragraph>{publisherData.publisher}</S.Paragraph>
						</S.Row>
						<S.Row>
							<S.Label>Senha: </S.Label>
							<S.Paragraph>{publisherData.passcode}</S.Paragraph>
						</S.Row>
					</S.DataContainer>
				)}
				{!publisherData && (
					<>
						<Controller
							control={control}
							rules={{ required: true }}
							name='name'
							render={({ field: { onChange, onBlur, value } }) => (
								<Input
									placeholder='Nome do publicador'
									onBlur={onBlur}
									onChangeText={onChange}
									value={value}
									editable={!publisherData}
								/>
							)}
						/>
						<Controller
							control={control}
							rules={{ required: false }}
							name='privileges'
							render={({ field: { onChange } }) => <CheckboxComponent onChange={onChange} />}
						/>
						<S.RowMargin>
							<Button
								disabled={!!publisherData}
								loading={formState.isSubmitting}
								onPress={handleSubmit(save)}
							>
								Atualizar
							</Button>
							{!session.data.publisher && (
								<IconButton
									icon='git-branch-outline'
									color={colors.success}
									onPress={showVinculateAlert}
								/>
							)}
							<IconButton icon='reload-outline' color={colors.warning} onPress={showResetAlert} />
							<IconButton icon='trash-bin-outline' color={colors.error} onPress={showDeleteAlert} />
						</S.RowMargin>
					</>
				)}
			</S.Content>
		</S.Container>
	)
}

export default EditPublisher
