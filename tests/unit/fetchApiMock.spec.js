import {KopnikApiError} from "../../src/KopnikError";

require('isomorphic-fetch');

import fetchApiMock from "../../src/bottle/fetchApi.mock";
import {bottle,container} from "../../src/plugins/bottle";



describe('unit.fetchApiMock', () => {
    beforeEach(() => {
        bottle.resetProviders(['cookieService'])
    })

    it('anonymous@test/login/1', async () => {
        let result = await fetchApiMock('test/login/1')
        expect(container.cookieService.cookie).toBe('user1')
        expect(result).toMatchSnapshot()
    });
    it('user1@users/get?ids=', async () => {
        await login(1)
        let result = await fetchApiMock('users/get?ids=')
        expect(result).toMatchSnapshot()
    });
    it('user1@users/get?ids=2', async () => {
        await login(1)
        let result = await fetchApiMock('users/get?ids=2')
        expect(result).toMatchSnapshot()
    });
    it('user1@users/get?ids=1,2,3', async () => {
        await login(1)
        let result = await fetchApiMock('users/get?ids=1,2,3')
        expect(result).toMatchSnapshot()
    })
})
