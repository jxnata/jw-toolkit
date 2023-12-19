import Button from 'components/Button'
import Input from 'components/Input'
import { Stack } from 'expo-router'
import usePublishers from 'hooks/swr/admin/usePublishers'
import { error, success } from 'messages/add'
import { useCallback, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Share } from 'react-native'
import { add } from 'services/publishers/add'
import { AddPublisherReq, AddPublisherRes } from 'types/api/publishers'
import * as S from './styles'

const AddPublisher = () => {
	const { mutate } = usePublishers()
	const [publisherData, setPublisherData] = useState<AddPublisherRes>()
	const { control, formState, handleSubmit } = useForm<AddPublisherReq>()

	const save: SubmitHandler<AddPublisherReq> = async data => {
		const result = await add(data)

		if (result) {
			success('publicador')
			setPublisherData({ publisher: data.name, passcode: result.passcode })
			mutate()
			return
		}

		error('publicador')
	}

	const sharePublisher = useCallback(async () => {
		await Share.share({
			message: `Seu login no JW Maps\n\nUsuário: ${publisherData.publisher}\nSenha: ${publisherData.passcode}`,
		})
	}, [publisherData])

	return (
		<S.Container>
			<Stack.Screen options={{ title: 'Novo Publicador' }} />
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
									autoCorrect={false}
									placeholder='Nome do publicador'
									onBlur={onBlur}
									onChangeText={onChange}
									value={value}
									editable={!publisherData}
								/>
							)}
						/>
						<Button
							disabled={!!publisherData}
							loading={formState.isSubmitting}
							onPress={handleSubmit(save)}
						>
							Salvar
						</Button>
					</>
				)}
			</S.Content>
		</S.Container>
	)
}

export default AddPublisher
