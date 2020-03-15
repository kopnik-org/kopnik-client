import {Kopnik} from "../../../src/models";
import {bottle, container} from "../../../src/bottle/bottle";
import {KopnikApiError} from "../../../src/KopnikError";
import Locale from "../../../src/locales/Locale";

describe('unit models Kopnik', () => {
    /** @type {Kopnik} */
    let kopnik
    describe('merge', () => {
        it('id', async () => {
            let kopnik = new Kopnik()
            kopnik.id = undefined
            kopnik.merge({id: 10})

            expect(kopnik.id).toBe(10)
        })

        it('scalar', async () => {
            let kopnik = new Kopnik()
            kopnik.firstName = "Павел"
            kopnik.merge({firstName: "Ярослав"})

            expect(kopnik.firstName).toBe("Ярослав")
        })

        it('does not merge absend scalar', async () => {
            let kopnik = new Kopnik()
            kopnik.firstName = "Ярослав"
            kopnik.merge({id: 10})

            expect(kopnik.firstName).toBe("Ярослав")
        })

        it('object', async () => {
            let kopnik = new Kopnik()
            kopnik.witness = undefined
            kopnik.merge({witness_id: 1})

            expect(kopnik.witness).toBe(Kopnik.getReference(1))
        })
        it('does not merge absend object', async () => {
            let kopnik = new Kopnik()
            kopnik.witness = Kopnik.getReference(1)
            kopnik.merge({id: 10})

            expect(kopnik.witness).toBe(Kopnik.getReference(1))
        })

        it('merge null', async () => {
            let kopnik = new Kopnik()
            kopnik.witness = Kopnik.getReference(1)
            kopnik.merge({witness_id: null})

            expect(kopnik.witness).toBe(null)
        })

        it('merge isLoaded', async () => {
            let kopnik = new Kopnik()
            kopnik.merge({isLoaded: true})

            expect(kopnik.isLoaded).toBe(true)
        })
        it('merge locale', async () => {
            let kopnik = new Kopnik()
            kopnik.merge({locale: 'ru'})

            expect(kopnik.locale).toBeInstanceOf(Locale)
        })
    })

    describe('plain', () => {
        it('Kopnik.plain', async () => {
            let kopnik = Kopnik.getReference(1)
            kopnik.firstName = "Ярослав"
            kopnik.witness = Kopnik.getReference(2)
            kopnik.ten = [Kopnik.getReference(3), Kopnik.getReference(4)]
            kopnik.locale=container.localeManager.currentLocale

            let plain = kopnik.plain
            expect(plain.id).toBe(1)
            expect(plain.firstName).toBe("Ярослав")
            expect(plain.witness_id).toBe(2)
            expect(plain.ten).toBeInstanceOf(Array)
            expect(plain.ten.length).toBe(2)
            expect(plain.ten[0]).toBe(3)
            expect(plain.locale).toBe('ru')
        })
    })

    describe('loaded', () => {
        beforeEach(() => {
            // удаляем, потому что ThanksVue пообует авторизоваться перед отрисовкой
            bottle.resetProviders(['application', 'cookieService'])
        })

        it('throw error without cookie', async () => {
            let kopnik2 = Kopnik.getReference(2)
            try {
                await kopnik2.loaded()
                throw new Error("should not be hire")
            } catch (e) {
                expect(e).toBeInstanceOf(KopnikApiError)
                expect(e.message).toContain('Auth')
            }
        })

        it('success', async () => {
            await login(1)
            let kopnik2 = Kopnik.getReference(2)
            await kopnik2.loaded()
            expect(kopnik2.plain).toMatchSnapshot()
        })
    })

    it('update', async () => {
        await login(3)
        kopnik = await Kopnik.get(3)
        await kopnik.update(kopnik.plain)
    })

    describe('anonymous', () => {
        beforeEach(async () => {
            kopnik = new Kopnik()
        })
    })

    describe('new', () => {
        beforeEach(async () => {
            bottle.resetProviders('cookieService')
            await login(2)
            kopnik = await Kopnik.get(2)
        })
    })

    describe('pending', () => {
        beforeAll(async () => {
            bottle.resetProviders('cookieService')
            await login(3)
            kopnik = await Kopnik.get(3)
        })
    })

    describe('declined', () => {
        beforeAll(async () => {
            bottle.resetProviders('cookieService')
            await login(4)
            kopnik = await Kopnik.get(4)
        })
    })

    describe('confirmed', () => {
        beforeAll(async () => {
            bottle.resetProviders('cookieService')
            await login(5)
            kopnik = await Kopnik.get(5)
        })

        it('loadedTen', async ()=>{
            await kopnik.loadedTen
        })
    })

    describe('confirmed witness', () => {
        let kopnik
        beforeAll(async () => {
            bottle.resetProviders(['cookieService'])
            await login(1)
            kopnik = await Kopnik.get(1)
        })
        it('reloadWitnessRequests', async () => {
            await kopnik.reloadWitnessRequests()
            expect(kopnik.witnessRequests).toBeInstanceOf(Array)
            expect(kopnik.witnessRequests[0]).toBeInstanceOf(Kopnik)
        })
        it('updateWitnessRequestStatus', async () => {
            await kopnik.updateWitnessRequestStatus({id: 3, status: 2})
        })
        it('loadedWitnessRequests', async ()=>{
            await kopnik.loadedWitnessRequests
        })
    })
})
