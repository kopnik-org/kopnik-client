import {Kopnik} from "../../../src/models";
import {bottle, container} from "../../../src/plugins/bottle";
import {KopnikApiError} from "../../../src/KopnikError";

describe('unit models Kopnik', () => {
    let kopnik
    describe('merge', () => {
        it('Kopnik.merge id', async () => {
            let kopnik1 = new Kopnik()
            kopnik1.id = undefined
            kopnik1.merge({id: 10})

            expect(kopnik1.id).toBe(10)
        })

        it('Kopnik.merge scalar', async () => {
            let kopnik1 = new Kopnik()
            kopnik1.firstName = "Павел"
            kopnik1.merge({firstName: "Ярослав"})

            expect(kopnik1.firstName).toBe("Ярослав")
        })

        it('Kopnik.merge does not merge absend scalar', async () => {
            let kopnik1 = new Kopnik()
            kopnik1.firstName = "Ярослав"
            kopnik1.merge({id: 10})

            expect(kopnik1.firstName).toBe("Ярослав")
        })

        it('Kopnik.merge object', async () => {
            let kopnik1 = new Kopnik()
            kopnik1.witness = undefined
            kopnik1.merge({witness_id: 1})

            expect(kopnik1.witness).toBe(Kopnik.getReference(1))
        })
        it('Kopnik.merge does not merge absend object', async () => {
            let kopnik1 = new Kopnik()
            kopnik1.witness = Kopnik.getReference(1)
            kopnik1.merge({id: 10})

            expect(kopnik1.witness).toBe(Kopnik.getReference(1))
        })

        it('Kopnik.merge merge null', async () => {
            let kopnik1 = new Kopnik()
            kopnik1.witness = Kopnik.getReference(1)
            kopnik1.merge({witness_id: null})

            expect(kopnik1.witness).toBe(null)
        })
    })

    describe('plain', () => {
        it('Kopnik.plain', async () => {
            let kopnik1 = Kopnik.getReference(1)
            kopnik1.firstName = "Ярослав"
            kopnik1.witness = Kopnik.getReference(2)
            kopnik1.ten = [Kopnik.getReference(3), Kopnik.getReference(4)]

            let plain = kopnik1.plain
            expect(plain.id).toBe(1)
            expect(plain.firstName).toBe("Ярослав")
            expect(plain.witness_id).toBe(2)
            expect(plain.ten).toBeInstanceOf(Array)
            expect(plain.ten.length).toBe(2)
            expect(plain.ten[0]).toBe(3)
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
            expect(kopnik2).toMatchSnapshot()
        })
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
        it('update', async () => {
            await kopnik.update(kopnik.plain)
        })
    })

    describe('pending', () => {
        beforeAll(async () => {
            bottle.resetProviders('cookieService')
            await login(3)
            kopnik = await Kopnik.get(3)
        })
        it('update', async () => {
            await kopnik.update(kopnik.plain)
        })
    })

    describe('declined', () => {
        beforeAll(async () => {
            bottle.resetProviders('cookieService')
            await login(4)
            kopnik = await Kopnik.get(4)
        })
        it('update', async () => {
            await kopnik.update(kopnik.plain)
        })
    })

    describe('confirmed', () => {
        beforeAll(async () => {
            bottle.resetProviders('cookieService')
            await login(5)
            kopnik = await Kopnik.get(5)
        })
        it('update', async () => {
            let result = await kopnik.update(kopnik.plain)
        })
    })

    describe('confirmed witness', () => {
        let kopnik
        beforeAll(async () => {
            bottle.resetProviders(['cookieService'])
            await login(1)
            kopnik = await Kopnik.get(1)
        })
        it('getPending', async () => {
            await kopnik.reloadJoining()
            expect(kopnik.joining.map(each => each.plain)).toMatchSnapshot()
        })
        it('updateJoiningStatus(pending)', async () => {
            await kopnik.updateJoiningStatus({id: 3, status: 2})
        })
    })
})
