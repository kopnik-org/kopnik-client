import {KopnikApiError} from "../../src/KopnikError";

require('isomorphic-fetch');

import fetchApiMock from "../../src/bottle/fetchApi.mock";

describe('unit.fetchApiMock', () => {
    it('users/get?ids=', async () => {
        let result = await fetchApiMock('users/get?ids=')
        expect(result).toMatchSnapshot()
    });
    it('users/get?ids=2', async () => {
        let result = await fetchApiMock('users/get?ids=2')
        expect(result).toMatchSnapshot()
    });
    it('users/get?ids=1,2,3', async () => {
        let result = await fetchApiMock('users/get?ids=1,2,3')
        expect(result).toMatchSnapshot()
    })
})
