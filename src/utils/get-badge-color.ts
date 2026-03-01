export const getBadgeColor = (tag: string) => {
	switch (tag) {
		case 'estudante':
			return 'bg-primary'
		case 'mudou-se':
			return 'bg-border'
		case 'nao-visitar':
			return 'bg-danger-500'
		default:
			return 'bg-border'
	}
}
