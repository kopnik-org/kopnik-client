import {bottle, container} from "../../src/plugins/bottle";
import {Kopnik} from "../../src/models";
import {KopnikApiError} from "../../src/KopnikError";

describe('unit/Application', () => {
    let application
    beforeEach(() => {
        bottle.resetProviders(['application'])
        application = container.application
    })
    it('authenticate() with cookie', async () => {
        await application.authenticate()
        expect(application.user).toBeInstanceOf(Kopnik)
    })
    it('authenticate() without cookie', async () => {
        try {
            var temp = container.defaultFetchApiOptions.headers.cookie
            container.defaultFetchApiOptions.headers.cookie = undefined
            await application.authenticate()
            expect(application.user).toBe(null)
        } finally {
            container.defaultFetchApiOptions.headers.cookie = temp
        }
    })
    it('resolveUser()', async () => {
        await application.resolveUser()
        expect(application.user).toBeInstanceOf(Kopnik)
    })
    it('top20()', async () => {
        await application.loadTop20()
        expect(application.top20).toBeInstanceOf(Array)
    })
})
