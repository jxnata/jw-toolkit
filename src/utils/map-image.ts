import { TOMTOM_API_KEY } from 'constants/env'
import reverse from 'lodash/reverse'

export const mapImage = (coordinates: [number, number]) => {
    return `https://api.tomtom.com/map/1/staticimage?key=${TOMTOM_API_KEY}&zoom=16&center=${reverse(coordinates).join(',')}&format=jpg&layer=basic&style=night&width=512&height=512&view=Unified&language=pt-BR`
}