import {KopnikApiError} from "../../../src/KopnikError";
import {AbstractSync, Kopnik} from "../../../src/models";
import {bottle, container} from "../../../src/bottle/bottle";

container.config.di.fetch = true

describe('system models Kopnik', () => {
    let kopnik

    beforeEach(() => {
        bottle.resetProviders(['cookieService'])
        AbstractSync.clearCache()
    })

    it('locale present', async () => {
        await login(1)
        const kopnik=  await Kopnik.get(1)
        expect(kopnik.locale).toBe('ru')
    })
    it('location is object', async () => {
        await login(1)
        const kopnik=  await Kopnik.get(1)
        expect(kopnik.location).toHaveProperty('lat')
        expect(kopnik.location).toHaveProperty('lng')
    })
    it('updateLocale', async () => {
        await login(1)
        const kopnik=  await Kopnik.get(1)
        await kopnik.updateLocale('ru')
    })
    it('isMessagesFromGroupAllowed', async () => {
        await login(1)
        const kopnik=  await Kopnik.get(1)
        const result= await kopnik.isMessagesFromGroupAllowed()
        expect(result).toBe(true)
    })
    it('getWitnessRequests have passport', async () => {
        await login(1)
        const kopnik= Kopnik.getReference(1)
        await kopnik.reloadWitnessRequests()
        expect(kopnik.witnessRequests).toBeInstanceOf(Array)
        expect(kopnik.witnessRequests[0]).toHaveProperty('passport')
        expect(kopnik.witnessRequests[0].passport).toBe(5220)
    })
    it('get havn\'t passport', async () => {
        await login(1)
        const kopnik=  await Kopnik.get(3)
        expect(kopnik.passport).toBeFalsy()
    })
})
