/**
 * Convert a string to a hex string with 8 chars
 * @param str - The string to convert
 * @returns The hex string
 */
export const toHex = (str: string) => {
	let h = 0x811c9dc5 >>> 0
	for (let i = 0; i < str.length; i++) {
		h ^= str.charCodeAt(i)
		h = Math.imul(h, 0x01000193) >>> 0
	}
	// convert to hex string with 8 chars
	return (h >>> 0).toString(16).padStart(8, '0')
}