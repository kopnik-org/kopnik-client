require('isomorphic-fetch');

import {Kopnik} from "../../../src/models";


describe('kopnik', () => {
    describe('kopnik merge', () => {
        it('Kopnik.merge id', async () => {
            let kopnik1 = new Kopnik()
            kopnik1.id = undefined
            kopnik1.merge({id: 10})

            expect(kopnik1.id).toBe(10)
        })

        it('Kopnik.merge scalar', async () => {
            let kopnik1 = new Kopnik()
            kopnik1.firstname = "Павел"
            kopnik1.merge({firstname: "Ярослав"})

            expect(kopnik1.firstname).toBe("Ярослав")
        })

        it('Kopnik.merge does not merge absend scalar', async () => {
            let kopnik1 = new Kopnik()
            kopnik1.firstname = "Ярослав"
            kopnik1.merge({id: 10})

            expect(kopnik1.firstname).toBe("Ярослав")
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

    describe('kopnik plain', () => {
        it('Kopnik.plain', async () => {
            let kopnik1 = Kopnik.getReference(1)
            kopnik1.firstname = "Ярослав"
            kopnik1.witness = Kopnik.getReference(2)
            kopnik1.ten = [Kopnik.getReference(3), Kopnik.getReference(4)]

            let plain = kopnik1.plain
            expect(plain.id).toBe(1)
            expect(plain.firstname).toBe("Ярослав")
            expect(plain.witness_id).toBe(2)
            expect(plain.ten).toBeInstanceOf(Array)
            expect(plain.ten.length).toBe(2)
            expect(plain.ten[0].id).toBe(3)
        })
    })

    describe('kopnik loaded', () => {
        it('Kopnik.loaded', async () => {
            let kopnik1 = Kopnik.getReference(1)
            await kopnik1.loaded()

            expect(kopnik1.isLoaded).toBeTruthy()
            expect(kopnik1.name).toMatch(/\w+/)
        })
    })

    describe('kopnik put witness request', () => {
        it.skip('Kopnik.putWitnessRequest success', async () => {
            let kopnik1 = Kopnik.getReference(1)
            await kopnik1.loaded()

          let result= await kopnik1.putWitnessRequest(kopnik1.plain)
            console.debug(result)
            // expect(kopnik1.name).toMatch(/\w+/)
        })
    })
})
