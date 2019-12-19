import {KopnikApiError} from "../../../src/KopnikError";

require('isomorphic-fetch');

import {Kopnik} from "../../../src/models";
import {bottle} from "../../../src/plugins/bottle";

describe('int.models.kopnik', () => {
    describe('loaded', () => {
        it('Kopnik.loaded throw error without cookie', async () => {
            let kopnik1 = Kopnik.getReference(1)
            try {
                var temp= bottle.container.defaultFetchApiOptions.headers.Cookie
                bottle.container.defaultFetchApiOptions.headers.Cookie= 'wrong cookie'
                await kopnik1.loaded()
            } catch (e) {
                expect(e).toBeInstanceOf(KopnikApiError)
                expect(e.message).toMatch(/no.+auth/i)
            } finally {
                bottle.container.defaultFetchApiOptions.headers.Cookie= temp
            }
            expect(kopnik1.isLoaded).toBeFalsy()
        })

        it('Kopnik.loaded', async () => {
            let kopnik1 = Kopnik.getReference(1)
            await kopnik1.loaded()
            expect(kopnik1.firstName).toMatch(/[а-я]/)
            expect(kopnik1.lastName).toMatch(/[а-я]/)
            expect(kopnik1.patronymic).toMatch(/[а-я]/)
            expect(kopnik1.photo).toMatch(/\w/)
            expect(Number.isInteger(kopnik1.birthyear)).toBeTruthy()
            // expect(Number.isInteger(kopnik1.passport)).toBeTruthy()
            expect(kopnik1.location).toBeInstanceOf(Array)
            expect(kopnik1.location[0]).toBeTruthy()

            expect(kopnik1.isLoaded).toBeTruthy()
            expect(kopnik1.name).toMatch(/[а-яА-ЯЁё]+/)
        })
    })

    describe('putWitnessRequest', () => {
        it.skip('Kopnik.putWitnessRequest success', async () => {
            let kopnik1 = Kopnik.getReference(1)
            await kopnik1.loaded()

            let result = await kopnik1.putWitnessRequest(kopnik1.plain)
            console.debug(result)
            // expect(kopnik1.name).toMatch(/\w+/)
        })
    })
})
