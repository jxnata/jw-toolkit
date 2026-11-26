// Phone numbers are stored as digits only (with country code if the admin typed it) so they can be searched and compared

const MIN_DIGITS = 8
const MAX_DIGITS = 15

export const normalizePhone = (value: string): string => (value || '').replace(/\D/g, '')

export const isValidPhone = (value: string): boolean => {
	const digits = normalizePhone(value)
	return digits.length >= MIN_DIGITS && digits.length <= MAX_DIGITS
}

// Brazilian formats: (11) 98765-4321, (11) 3456-7890, +55 (11) 98765-4321; anything else is shown as typed
export const formatPhone = (value: string): string => {
	const digits = normalizePhone(value)

	if (digits.length === 13 && digits.startsWith('55')) {
		return `+55 ${formatPhone(digits.slice(2))}`
	}
	if (digits.length === 11) {
		return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
	}
	if (digits.length === 10) {
		return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
	}
	if (digits.length === 9) {
		return `${digits.slice(0, 5)}-${digits.slice(5)}`
	}
	if (digits.length === 8) {
		return `${digits.slice(0, 4)}-${digits.slice(4)}`
	}
	return digits
}

export interface ParsedPhoneList {
	// Valid numbers (digits only), in the order typed, without repetitions
	numbers: string[]
	// Lines that are not a valid number, as typed
	invalid: string[]
	// How many valid lines repeated a number already in the list
	repeated: number
}

// Splits a pasted list (one number per line; commas and semicolons also separate), ignoring blank lines
export const parsePhoneList = (text: string): ParsedPhoneList => {
	const numbers: string[] = []
	const invalid: string[] = []
	let repeated = 0

	for (const raw of (text || '').split(/[\n\r,;]+/)) {
		const line = raw.trim()
		if (!line) continue

		if (!isValidPhone(line)) {
			invalid.push(line)
			continue
		}

		const digits = normalizePhone(line)
		if (numbers.includes(digits)) {
			repeated++
			continue
		}
		numbers.push(digits)
	}

	return { numbers, invalid, repeated }
}

export const getCallUrl = (value: string): string => `tel:${normalizePhone(value)}`

// WhatsApp needs the country code: numbers with area code but without it are assumed to be Brazilian
export const getWhatsAppUrl = (value: string): string => {
	const digits = normalizePhone(value)
	const international = digits.length === 10 || digits.length === 11 ? `55${digits}` : digits
	return `https://wa.me/${international}`
}
