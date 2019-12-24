import {bottle, container} from "../../src/plugins/bottle";
import {Kopnik} from "../../src/models";

describe('unit/Application', () => {
    let application
    beforeEach(() => {
        // сбросить application потому что в конце каждого теста #user уже установлен
        // сбросить cookieService потому что кука подставляется нулевая в одном тесте
        bottle.resetProviders(['application', 'cookieService'])
        application = container.application
    })
    it('authenticate() with cookie', async () => {
        await application.authenticate()
        expect(application.user).toBeInstanceOf(Kopnik)
    })
    it('authenticate() without cookie', async () => {
        container.cookieService.push()
        await application.authenticate()
        expect(application.user).toBe(null)
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
