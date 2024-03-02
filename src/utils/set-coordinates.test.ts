import { setCoordinates } from './set-coordinates'

describe('setCoordinates', () => {
	it('must remove other characters and return correct coordinates', () => {
		const correct = [-41.88384, -11.45432]

		const result = setCoordinates('(-41.88384, -11.45432)')

		expect(result).toStrictEqual(correct)
	})
	it('must return coordinates zero if string is empty', () => {
		const correct = [0, 0]

		const result = setCoordinates('')

		expect(result).toStrictEqual(correct)
	})
	it('must remove all invalid characters', () => {
		const correct = [0, 0]

		const result = setCoordinates('!@#$%ˆ&*()<>,.?/;:|][{}~`=-+')

		expect(result).toStrictEqual(correct)
	})
	it('must remove all invalid characters and preserve coordinates', () => {
		const correct = [-41.88384, -11.45432]

		const result = setCoordinates('!@,#$,%ˆ&*()<>-41.88384,-11.45432.?/;:|][{}~`=-+')

		expect(result).toStrictEqual(correct)
	})
	it('must get coordinates from google maps url', () => {
		const correct = [-11.2992442, -41.847877]
		const url =
			'https://www.google.com/maps/place/R.+Barros+R%C3%A9is,+480+-+Irece,+Irec%C3%AA+-+BA,+44900-000/@-11.2992442,-41.847877,19.18z/data=!4m6!3m5!1s0x76ed4a3869ef29b:0x3841d48c8e183142!8m2!3d-11.2991435!4d-41.8472554!16s%2Fg%2F11tjs84709?entry=ttu'

		const result = setCoordinates(url)

		expect(result).toStrictEqual(correct)
	})
})
