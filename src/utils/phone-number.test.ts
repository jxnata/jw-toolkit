import { formatPhone, getCallUrl, getWhatsAppUrl, isValidPhone, normalizePhone, parsePhoneList } from './phone-number'

describe('normalizePhone', () => {
	it('keeps only digits', () => {
		expect(normalizePhone('+55 (11) 98765-4321')).toBe('5511987654321')
	})

	it('returns empty string for empty input', () => {
		expect(normalizePhone('')).toBe('')
	})
})

describe('isValidPhone', () => {
	it('accepts numbers between 8 and 15 digits', () => {
		expect(isValidPhone('3456-7890')).toBe(true)
		expect(isValidPhone('(11) 98765-4321')).toBe(true)
		expect(isValidPhone('+55 11 98765-4321')).toBe(true)
	})

	it('rejects too short or too long numbers', () => {
		expect(isValidPhone('1234567')).toBe(false)
		expect(isValidPhone('1234567890123456')).toBe(false)
		expect(isValidPhone('abc')).toBe(false)
	})
})

describe('formatPhone', () => {
	it('formats Brazilian mobile and landline numbers', () => {
		expect(formatPhone('11987654321')).toBe('(11) 98765-4321')
		expect(formatPhone('1134567890')).toBe('(11) 3456-7890')
	})

	it('formats numbers with the Brazilian country code', () => {
		expect(formatPhone('5511987654321')).toBe('+55 (11) 98765-4321')
	})

	it('formats numbers without area code', () => {
		expect(formatPhone('987654321')).toBe('98765-4321')
		expect(formatPhone('34567890')).toBe('3456-7890')
	})

	it('returns other numbers as digits', () => {
		expect(formatPhone('441234567890')).toBe('441234567890')
	})
})

describe('getCallUrl', () => {
	it('builds a tel url with digits only', () => {
		expect(getCallUrl('(11) 98765-4321')).toBe('tel:11987654321')
	})
})

describe('getWhatsAppUrl', () => {
	it('adds the Brazilian country code when missing', () => {
		expect(getWhatsAppUrl('(11) 98765-4321')).toBe('https://wa.me/5511987654321')
	})

	it('keeps numbers that already have a country code', () => {
		expect(getWhatsAppUrl('+55 11 98765-4321')).toBe('https://wa.me/5511987654321')
	})
})

describe('parsePhoneList', () => {
	it('parses one number per line, normalizing to digits', () => {
		expect(parsePhoneList('(11) 98765-4321\n11 3456-7890')).toEqual({
			numbers: ['11987654321', '1134567890'],
			invalid: [],
			repeated: 0,
		})
	})

	it('accepts a single number', () => {
		expect(parsePhoneList('(11) 98765-4321').numbers).toEqual(['11987654321'])
	})

	it('ignores blank lines, spaces and Windows line breaks', () => {
		expect(parsePhoneList('\n  (11) 98765-4321  \r\n\r\n3456-7890\n').numbers).toEqual(['11987654321', '34567890'])
	})

	it('also splits on commas and semicolons', () => {
		expect(parsePhoneList('3456-7890, 3456-7891; 3456-7892').numbers).toEqual(['34567890', '34567891', '34567892'])
	})

	it('drops repeated numbers even when typed in different formats', () => {
		const result = parsePhoneList('(11) 98765-4321\n11987654321\n11 98765 4321')
		expect(result.numbers).toEqual(['11987654321'])
		expect(result.repeated).toBe(2)
	})

	it('collects invalid lines as typed', () => {
		const result = parsePhoneList('123\n(11) 98765-4321\nligar depois')
		expect(result.numbers).toEqual(['11987654321'])
		expect(result.invalid).toEqual(['123', 'ligar depois'])
	})

	it('returns empty lists for empty input', () => {
		expect(parsePhoneList('')).toEqual({ numbers: [], invalid: [], repeated: 0 })
	})
})
