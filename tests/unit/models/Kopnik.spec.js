import {Kopnik} from "../../../src/models";
import {bottle} from "../../../src/plugins/bottle";
import {KopnikApiError} from "../../../src/KopnikError";

describe('unit.models.Kopnik', () => {
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
            expect(plain.ten[0].id).toBe(3)
        })
    })

    describe('loaded', () => {
        it('throw error without cookie', async () => {
            let kopnik1 = Kopnik.getReference(2)
            try {
                var temp= bottle.container.defaultFetchApiOptions.headers.cookie
                bottle.container.defaultFetchApiOptions.headers.cookie= null
                await kopnik1.loaded()
            } catch (e) {
                // console.log(e)
                expect(e).toBeInstanceOf(KopnikApiError)
                expect(e.message).toMatch(/no.+auth/i)
            } finally {
                bottle.container.defaultFetchApiOptions.headers.cookie= temp
            }
            expect(kopnik1.isLoaded).toBeFalsy()
        })

        it('success', async () => {
            let kopnik1 = Kopnik.getReference(2)
            await kopnik1.loaded()
            expect(kopnik1.firstName).toMatch(/[а-я]/)
            expect(kopnik1.lastName).toMatch(/[а-я]/)
            expect(kopnik1.patronymic).toMatch(/[а-я]|\w/)
            expect(kopnik1.photo).toMatch(/\w/)
            expect(Number.isInteger(kopnik1.birthyear)).toBeTruthy()
            // expect(Number.isInteger(kopnik1.passport)).toBeTruthy()
            expect(kopnik1.location).toBeInstanceOf(Array)
            expect(kopnik1.location[0]).toBeTruthy()

            expect(kopnik1.isLoaded).toBeTruthy()
            expect(kopnik1.name).toMatch(/[а-яА-ЯЁё]+/)
        })
    })
})
