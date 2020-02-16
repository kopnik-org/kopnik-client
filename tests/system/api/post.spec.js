import api from "../../../src/api";
import {bottle, container} from "../../../src/bottle/bottle";
import {KopnikApiError} from "../../../src/KopnikError";
import {AbstractSync, Kopnik} from "../../../src/models";

/**
 * Реализация без участия контейнера
 * @param id
 * @returns {Promise<*|undefined>}
 */
function login(id) {
    return api('test/login/' + id)
}

container.config.di.fetch = true

describe('system api post', () => {
    beforeEach(async () => {
        AbstractSync.clearCache()
    })
    describe('anonymous', () => {
        beforeAll(() => {
            bottle.resetProviders(['cookieService'])
        })
        it('users/update', async () => {
            let kopnik = new Kopnik()
            try {
                await api('users/update', {
                    method: 'POST',
                    body: {
                        id: 2,
                        status: 2,
                    }
                })
                throw new Error("should not be hire")
            } catch (err) {
                expect(err).toBeInstanceOf(KopnikApiError)
                expect(err.code).toBe(401)
                expect(err).toMatchSnapshot()
            }
        })
        it('users/pending/update', async () => {
            let kopnik = new Kopnik()
            try {
                await api('users/pending/update', {
                    method: 'POST',
                    body: {
                        id: 1,
                        status: 2,
                    }
                })
                throw new Error("should not be hire")
            } catch (err) {
                expect(err).toBeInstanceOf(KopnikApiError)
                expect(err.code).toBe(401)
                expect(err).toMatchSnapshot()
            }
        })
    })
    /********************************************************
     * user_1_confirmed (witness)
     *******************************************************/
    describe('user1', () => {
        beforeAll(async () => {
            await login(1)
        })

        it('users/pending/update', async () => {
            let result = await api('users/pending/update', {
                method: 'POST',
                body: {
                    id: 3,
                    status: 2,
                }
            })
            let kopnik = await Kopnik.get(3)
            expect(kopnik.status).toBe(2)
            expect(result).toMatchSnapshot()
        })

        it('users/pending/update(new)', async () => {
            try {
                await api('users/pending/update', {
                    method: 'POST',
                    body: {
                        id: 2,
                        status: 2,
                    }
                })
                throw new Error("should not be hire")
            } catch (err) {
                expect(err).toBeInstanceOf(KopnikApiError)
                expect(err.code).toBe(5)
            }
        })
        it('users/pending/update(declined)', async () => {
            try {
                await api('users/pending/update', {
                    method: 'POST',
                    body: {
                        id: 4,
                        status: 2,
                    }
                })
                throw new Error("should not be hire")
            } catch (err) {
                expect(err).toBeInstanceOf(KopnikApiError)
                expect(err.code).toBe(5)
            }
        })
        it('users/pending/update(confirmed)', async () => {
            try {
                await api('users/pending/update', {
                    method: 'POST',
                    body: {
                        id: 5,
                        status: 2,
                    }
                })
                throw new Error("should not be hire")
            } catch (err) {
                expect(err).toBeInstanceOf(KopnikApiError)
                expect(err.code).toBe(5)
            }
        })

    })
    /********************************************************
     * user_2_new
     *******************************************************/
    describe('user2', () => {
        beforeAll(async () => {
            await login(2)
        })
        it('users/update', async () => {
            const kopnik = await Kopnik.get(2)
            let result = await api('users/update', {
                method: 'POST',
                body: kopnik.plain
            })
            await kopnik.reload()
            expect(kopnik.status).toBe(1)
            expect(result).toMatchSnapshot()
        })
        it('users/pending/update', async () => {
            try {
                await api('users/pending/update', {
                    method: 'POST',
                    body: {
                        id: 3,
                        status: 2,
                    }
                })
                throw new Error("should not be hire")
            } catch (err) {
                expect(err).toBeInstanceOf(KopnikApiError)
                expect(err.code).toBe(403)
                expect(err).toMatchSnapshot()
            }
        })
    })
    /********************************************************
     * user_3_pending
     *******************************************************/
    describe('user3', () => {
        beforeAll(async () => {
            await login(3)
        })
        it('users/update', async () => {
            const kopnik = await Kopnik.get(3)
            let result = await api('users/update', {
                method: 'POST',
                body: kopnik.plain,
            })
            await kopnik.reload()
            expect(kopnik.status).toBe(1)
            expect(result).toMatchSnapshot()
        })
        it('users/pending/update', async () => {
            try {
                await api('users/pending/update', {
                    method: 'POST',
                    body: {
                        id: 3,
                        status: 2,
                    }
                })
                throw new Error("should not be hire")
            } catch (err) {
                expect(err).toBeInstanceOf(KopnikApiError)
                expect(err.code).toBe(403)
                expect(err).toMatchSnapshot()
            }
        })
    })
    /********************************************************
     * user_4_declined
     *******************************************************/
    describe('user4', () => {
        beforeAll(async () => {
            await login(4)
        })
        it('users/update', async () => {
            const kopnik = await Kopnik.get(4)
            let result = await api('users/update', {
                method: 'POST',
                body: kopnik.plain
            })
            await kopnik.reload()
            expect(kopnik.status).toBe(1)
            expect(result).toMatchSnapshot()
        })
        it('users/pending/update', async () => {
            try {
                await api('users/pending/update', {
                    method: 'POST',
                    body: {
                        id: 3,
                        status: 2,
                    }
                })
                throw new Error("should not be hire")
            } catch (err) {
                expect(err).toBeInstanceOf(KopnikApiError)
                expect(err.code).toBe(403)
                expect(err).toMatchSnapshot()
            }
        })
    })
    /********************************************************
     * user_5_confirmed
     *******************************************************/
    describe('user5', () => {
        beforeAll(async () => {
            await login(5)
        })
        it('users/update', async () => {
            const kopnik = await Kopnik.get(5)
            let result = await api('users/update', {
                method: 'POST',
                body: kopnik.plain
            })
            await kopnik.reload()
            expect(kopnik.status).toBe(1)
            expect(result).toMatchSnapshot()
        })
        it('users/pending/update', async () => {
            try {
                await api('users/pending/update', {
                    method: 'POST',
                    body: {
                        id: 3,
                        status: 2,
                    }
                })
                throw new Error("should not be hire")
            } catch (err) {
                expect(err).toBeInstanceOf(KopnikApiError)
                expect(err.code).toBe(403)
                expect(err).toMatchSnapshot()
            }
        })
    })

    /********************************************************
     * user_6_foreman
     *******************************************************/
    describe('user6', () => {
        beforeAll(async () => {
            await login(6)
        })
    })
})

