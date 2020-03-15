import {KopnikApiError} from "../../../src/KopnikError";
import {bottle, container} from "../../../src/bottle/bottle";

import api from "../../../src/api";

describe('system api simple', () => {
    beforeEach(async () => {
        bottle.resetProviders(['cookieService'])
    })

    it('setupDB', async () => {
        await api('test/setupDB')

    })

    // TODO: fix fetch-intersect intersects every fetch
    it.skip('login by original fetch', async () => {
        const url= container.config.api.path+'/test/login/1'
        const result = await fetch(url)
        expect(result.headers.get('set-cookie')).toBeTruthy()
    })

    it('login', async () => {
        await api('test/login/1')
        expect(container.cookieService.cookie).toBeTruthy()
    })

    it('test/get&ids=', async () => {
        await api('test/login/1')
        let result = await api('users/get?ids=')
        expect(result).toBeInstanceOf(Array)
    })
})


