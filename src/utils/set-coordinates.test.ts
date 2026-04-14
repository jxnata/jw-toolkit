import { setCoordinates } from './set-coordinates'

describe('setCoordinates', () => {
	describe('standard dot-decimal format', () => {
		it('parses negative lat and lng', () => {
			expect(setCoordinates('-11.2999817,-41.8700088')).toEqual([-11.2999817, -41.8700088])
		})

		it('parses positive lat and lng', () => {
			expect(setCoordinates('11.2999817,41.8700088')).toEqual([11.2999817, 41.8700088])
		})

		it('parses mixed sign coordinates', () => {
			expect(setCoordinates('-11.2999817,41.8700088')).toEqual([-11.2999817, 41.8700088])
		})

		it('handles extra whitespace around the string', () => {
			expect(setCoordinates('  -11.2999817,-41.8700088  ')).toEqual([-11.2999817, -41.8700088])
		})
	})

	describe('comma-as-decimal format', () => {
		it('parses negative lat and lng with comma decimal separator', () => {
			expect(setCoordinates('-11,2999817,-41,8700088')).toEqual([-11.2999817, -41.8700088])
		})

		it('parses positive lat and lng with comma decimal separator', () => {
			expect(setCoordinates('11,2999817,41,8700088')).toEqual([11.2999817, 41.8700088])
		})

		it('parses mixed sign coordinates with comma decimal separator', () => {
			expect(setCoordinates('-11,2999817,41,8700088')).toEqual([-11.2999817, 41.8700088])
		})
	})

	describe('integer coordinates', () => {
		it('parses integer lat and lng', () => {
			expect(setCoordinates('-11,-41')).toEqual([-11, -41])
		})

		it('parses positive integer coordinates', () => {
			expect(setCoordinates('11,41')).toEqual([11, 41])
		})
	})

	describe('Google Maps URL extraction', () => {
		it('extracts coordinates from a /@lat,lng URL', () => {
			expect(setCoordinates('https://www.google.com/maps/@-11.2999817,-41.8700088,14z')).toEqual([
				-11.2999817, -41.8700088,
			])
		})

		it('extracts coordinates from a ?q=lat,lng URL', () => {
			expect(setCoordinates('https://maps.google.com/?q=-11.2999817,-41.8700088')).toEqual([
				-11.2999817, -41.8700088,
			])
		})
	})

	describe('invalid input', () => {
		it('returns [0, 0] for empty string', () => {
			expect(setCoordinates('')).toEqual([0, 0])
		})

		it('returns [0, 0] for non-coordinate text', () => {
			expect(setCoordinates('invalid text')).toEqual([0, 0])
		})

		it('returns [0, 0] for null-like input', () => {
			expect(setCoordinates(null as any)).toEqual([0, 0])
		})

		it('returns [0, 0] for undefined input', () => {
			expect(setCoordinates(undefined as any)).toEqual([0, 0])
		})
	})
})
