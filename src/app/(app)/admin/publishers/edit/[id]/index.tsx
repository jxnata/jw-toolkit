import Button from 'components/Button'
import IconButton from 'components/IconButton'
import Input from 'components/Input'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import usePublisher from 'hooks/swr/admin/usePublisher'
import usePublishers from 'hooks/swr/admin/usePublishers'
import { error as removeError, success as removeSuccess } from 'messages/delete'
import { error, success } from 'messages/edit'
import { error as resetError, success as resetSuccess } from 'messages/reset'
import { useCallback, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Alert, Share } from 'react-native'
import { edit } from 'services/publishers/edit'
import { remove } from 'services/publishers/remove'
import { reset } from 'services/publishers/reset'
import { colors } from 'themes'
import { EditPublisherReq, ResetPublisherRes } from 'types/api/publishers'
import { IPublisher } from 'types/models/Publisher'
import * as S from './styles'

const EditPublisher = () => {
	const params: Partial<IPublisher> = useLocalSearchParams()
	const { publisher, mutate: mutatePublisher } = usePublisher(params._id)
	const { mutate } = usePublishers({ all: true, search: '' })
	const [publisherData, setPublisherData] = useState<ResetPublisherRes>()
	const { control, formState, handleSubmit } = useForm<EditPublisherReq>({ defaultValues: { name: params.name } })

	const save: SubmitHandler<EditPublisherReq> = async data => {
		const result = await edit(publisher._id, data)

		if (result) {
			success('publicador')
			mutate()
			mutatePublisher()
			return
		}

		error('publicador')
	}

	const resetPassword = async () => {
		const result = await reset(publisher._id)

		if (result) {
			resetSuccess('publicador')
			setPublisherData({ publisher: publisher.name, passcode: result.passcode })
			mutate()
			return
		}

		resetError('publicador')
	}

	const deletePublisher = async () => {
		const result = await remove(publisher._id)

		if (result) {
			removeSuccess('publicador')
			mutate()
			router.back()
			return
		}

		removeError('publicador')
	}

	const sharePublisher = useCallback(async () => {
		await Share.share({
			message: `Seu login no JW Maps\n\nUsuário: ${publisherData.publisher}\nSenha: ${publisherData.passcode}`,
		})
	}, [publisherData])

	const showResetAlert = () =>
		Alert.alert(
			'Resetar',
			'Deseja criar uma nova senha para o publicador? A senha antiga será deletada e ele precisará fazer login novamente.',
			[
				{
					text: 'Cancelar',
					// onPress: () => {},
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
					// onPress: () => {},
					style: 'cancel',
				},
				{
					text: 'Sim, excluir',
					onPress: () => deletePublisher(),
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
						<S.Row>
							<Button
								disabled={!!publisherData}
								loading={formState.isSubmitting}
								onPress={handleSubmit(save)}
							>
								Atualizar
							</Button>
							<IconButton icon='reload-outline' color={colors.warning} onPress={showResetAlert} />
							<IconButton icon='trash-bin-outline' color={colors.error} onPress={showDeleteAlert} />
						</S.Row>
					</>
				)}
			</S.Content>
		</S.Container>
	)
}

export default EditPublisher
