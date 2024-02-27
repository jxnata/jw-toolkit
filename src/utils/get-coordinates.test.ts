import { getCoordinates } from "./get-coordinates"

describe('getCoordinates', () => {
    it('must return coordinates in string format', () => {
        const result = getCoordinates([-41.88384, -11.45432])
        expect(result).toBe('-41.88384,-11.45432')
    })
})