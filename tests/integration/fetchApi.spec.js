import {KopnikApiError} from "../../src/KopnikError";

require('isomorphic-fetch');
import prettyFormat from 'pretty-format'

import fetchApi from "../../src/bottle/fetchApi";

describe('integration/fetchApi', () => {
    it('users/get?ids=', async () => {
        let result = await fetchApi('users/get?ids=')
        expect(result).toMatchSnapshot()
    });
    it('users/get?ids=1', async () => {
        let result = await fetchApi('users/get?ids=1')
        expect(result).toMatchSnapshot()
    });
    it('users/get?ids=2', async () => {
        let result = await fetchApi('users/get?ids=2')
        expect(result).toMatchSnapshot()
    });
    it('users/get?ids=3', async () => {
        let result = await fetchApi('users/get?ids=3')
        expect(result).toMatchSnapshot()
    });
    it('users/get?ids=4', async () => {
        let result = await fetchApi('users/get?ids=4')
        expect(result).toMatchSnapshot()
    });
    it('users/get?ids=1,2,3', async () => {
        let result = await fetchApi('users/get?ids=1,2,3')
        expect(result).toMatchSnapshot()
    })
})

