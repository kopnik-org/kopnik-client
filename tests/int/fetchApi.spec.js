import {KopnikApiError} from "../../src/KopnikError";

require('isomorphic-fetch');

import {Kopnik} from "../../src/models";
import {bottle, container} from "../../src/plugins/bottle";

describe('int.fetchApi', () => {
    const fetchApi = container.fetchApi
    describe('users', () => {
        it('get?id=1', async () => {
            let result = await fetchApi('users/get?id=1')
            expect(result).toMatchSnapshot()
        })
    })
})

