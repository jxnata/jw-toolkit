import { firstUpper } from "./first-upper"

describe('firstUpper', () => {
    it('must return the first letter of the word in uppercase', () => {
        const result = firstUpper('hello')
        expect(result).toBe('Hello')
    })

    it('must return empty for empty strings', () => {
        const result = firstUpper('')
        expect(result).toBe('')
    })
})