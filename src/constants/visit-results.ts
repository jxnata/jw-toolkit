export interface VisitOption {
	value: string
	icon: string
	iconColor: string
	bgColor: string
	title: string
	description: string
}

export const questionOptions: VisitOption[] = [
	{
		value: 'yes',
		icon: '',
		iconColor: '#719453',
		bgColor: 'bg-success/10',
		title: 'Sim',
		description: 'Encontrei alguém em casa',
	},
	{
		value: 'no',
		icon: '',
		iconColor: '#bf616a',
		bgColor: 'bg-danger/10',
		title: 'Não',
		description: 'Não encontrei o morador',
	},
]

export const foundOptions: VisitOption[] = [
	{
		value: 'Encontrou o surdo',
		icon: '',
		iconColor: '#bb7424',
		bgColor: 'bg-primary/10',
		title: 'Encontrou o surdo',
		description: 'A pessoa surda estava em casa',
	},
	{
		value: 'Encontrou um familiar',
		icon: '',
		iconColor: '#bb7424',
		bgColor: 'bg-primary/10',
		title: 'Encontrou um familiar',
		description: 'Um familiar estava presente',
	},
	{
		value: 'Convidei para a Celebração',
		icon: '',
		iconColor: '#bb7424',
		bgColor: 'bg-primary/10',
		title: 'Convidei para a Celebração',
		description: 'Entregou convite para a Celebração da Morte de Cristo',
	},
	{
		value: 'Convidei para o Congresso',
		icon: '',
		iconColor: '#bb7424',
		bgColor: 'bg-primary/10',
		title: 'Convidei para o Congresso',
		description: 'Entregou convite para o Congresso',
	},
	{
		value: 'Outro',
		icon: '',
		iconColor: '#bb7424',
		bgColor: 'bg-primary/10',
		title: 'Outro',
		description: 'Outra situação ocorreu',
	},
]

export const notFoundOptions: VisitOption[] = [
	{
		value: 'Ninguém em casa',
		icon: '',
		iconColor: '#bf616a',
		bgColor: 'bg-danger/10',
		title: 'Ninguém em casa',
		description: 'Ninguém atendeu',
	},
	{
		value: 'Mudou-se',
		icon: '',
		iconColor: '#bf616a',
		bgColor: 'bg-danger/10',
		title: 'Mudou-se',
		description: 'O surdo não mora mais neste endereço',
	},
	{
		value: 'Faleceu',
		icon: '',
		iconColor: '#bf616a',
		bgColor: 'bg-danger/10',
		title: 'Faleceu',
		description: 'Informaram que o surdo faleceu',
	},
	{
		value: 'Não mora surdo aqui',
		icon: '',
		iconColor: '#bf616a',
		bgColor: 'bg-danger/10',
		title: 'Não mora surdo aqui',
		description: 'Os moradores disseram que não há surdo no endereço',
	},
	{
		value: 'Endereço não localizado',
		icon: '',
		iconColor: '#bf616a',
		bgColor: 'bg-danger/10',
		title: 'Endereço não localizado',
		description: 'Não foi possível achar o endereço',
	},
	{
		value: 'Outro motivo',
		icon: '',
		iconColor: '#bf616a',
		bgColor: 'bg-danger/10',
		title: 'Outro motivo',
		description: 'Não encontrou por outro motivo',
	},
]
