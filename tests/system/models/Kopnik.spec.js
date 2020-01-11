import {KopnikApiError} from "../../../src/KopnikError";
import {Kopnik} from "../../../src/models";
import {bottle, container} from "../../../src/plugins/bottle";

container.config.di.fetch = true

describe('system models Kopnik', () => {
    beforeEach(() => {
        bottle.resetProviders(['cookieService'])
    })
    describe('anonymous', () => {
        it('update', async () => {
            let kopnik = new Kopnik()
            try {
                let result = await kopnik.update(kopnik.plain)
                throw new Error("should not be hire")
            } catch (err) {
                expect(err).toBeInstanceOf(KopnikApiError)
                // TODO: expect(err.code).toBe(401)
                expect(err.message).toContain('auth')
            }
        })
    })

    describe('new', () => {
        beforeEach(async () => {
            await login(2)
        })
        it('update', async () => {
            let kopnik = await Kopnik.get(2)
            await kopnik.update(kopnik.plain)
            await kopnik.reload()
            expect(kopnik.status).toBe(1)
        })
    })

    describe('pending', () => {
        beforeEach(async () => {
            await login(3)
        })
        it('update', async () => {
            let kopnik = await Kopnik.get(3)
            await kopnik.update(kopnik.plain)
            await kopnik.reload()
            expect(kopnik.status).toBe(1)
        })
    })

    describe('declined', () => {
        beforeEach(async () => {
            await login(4)
        })
        it('update', async () => {
            let kopnik = await Kopnik.get(4)
            await kopnik.update(kopnik.plain)
            await kopnik.reload()
            expect(kopnik.status).toBe(1)
        })
    })

    describe('confirmed', () => {
        beforeEach(async () => {
            await login(5)
        })
        it.only('update', async () => {
            let kopnik = await Kopnik.get(5)
            let result = await kopnik.update(kopnik.plain)
            await kopnik.reload()
            expect(kopnik.status).toBe(1)
        })
    })
})
