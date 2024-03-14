import Button from 'components/Button'
import Input from 'components/Input'
import { DEFAULT_PRIVILEGES } from 'constants/content'
import { JW_TOOLKIT_API } from 'constants/urls'
import { Stack } from 'expo-router'
import usePublishers from 'hooks/swr/admin/usePublishers'
import useCheckbox from 'hooks/useCheckbox'
import compact from 'lodash/compact'
import { error, success } from 'messages/add'
import { useCallback, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Share } from 'react-native'
import { add } from 'services/publishers/add'
import { AddPublisherReq, AddPublisherRes } from 'types/api/publishers'

import * as S from './styles'

const AddPublisher = () => {
	const { mutate } = usePublishers({ all: true, search: '' })
	const [publisherData, setPublisherData] = useState<AddPublisherRes>()
	const { control, formState, handleSubmit } = useForm<AddPublisherReq>()
	const { CheckboxComponent } = useCheckbox(DEFAULT_PRIVILEGES)

	const save: SubmitHandler<AddPublisherReq> = async data => {
		if (!data.privileges) {
			data.privileges = []
		}

		const result = await add({ ...data, privileges: compact(data.privileges || []) })

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
			message: `Seu login no JW Maps\n\nUsuário: ${publisherData.publisher}\nSenha: ${publisherData.passcode}\n\nLink para entrar:\n${JW_TOOLKIT_API}/go/auth?type=publisher&user=${publisherData.publisher}&pass=${publisherData.passcode}`,
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
							render={({ field: { onChange, onBlur, value } }) => (
								<CheckboxComponent onChange={onChange} />
							)}
						/>
						<S.RowMargin>
							<Button
								disabled={!formState.isValid}
								loading={formState.isSubmitting}
								onPress={handleSubmit(save)}
							>
								Salvar
							</Button>
						</S.RowMargin>
					</>
				)}
			</S.Content>
		</S.Container>
	)
}

export default AddPublisher
