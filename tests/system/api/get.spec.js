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

describe('system api get', () => {
    beforeEach(async () => {
        AbstractSync.clearCache()
    })
    describe('anonymous', () => {
        beforeEach(() => {
            bottle.resetProviders(['cookieService'])
        })
        it('users/get?ids=1', async () => {
            try {
                await api('users/get?ids=')
                throw new Error('should not be hire')
            } catch (err) {
                expect(err.message).toContain('auth')
                expect(err).toBeInstanceOf(KopnikApiError)
            }
        })
        it('test/login/1', async () => {
            let result = await login(1)
            expect(container.cookieService.cookie).toContain('PHPSESSID')
            expect(result).toMatchSnapshot()
        })
        it('test/login/2', async () => {
            let result = await login(2)
            expect(container.cookieService.cookie).toContain('PHPSESSID')
            expect(result).toMatchSnapshot()
        })
        it('test/login/3', async () => {
            let result = await login(3)
            expect(container.cookieService.cookie).toContain('PHPSESSID')
            expect(result).toMatchSnapshot()
        })
        it('test/login/4', async () => {
            let result = await login(4)
            expect(result).toMatchSnapshot()
        })
        it('test/login/5', async () => {
            let result = await login(5)
            expect(result).toMatchSnapshot()
        })
        it('test/login/6', async () => {
            let result = await login(6)
            expect(container.cookieService.cookie).toContain('PHPSESSID')
            expect(result).toMatchSnapshot()
        })
        it('users/pending', async () => {
            try {
                await api('users/pending')
                throw new Error('should not be hire')
            } catch (err) {
                expect(err).toBeInstanceOf(KopnikApiError)
                expect(err.code).toBe(401)
                expect(err).toMatchSnapshot()
            }
        })
        it('users/getTopInsideSquare?x1=-180&y1=-90&x2=180&y2=90&count=20', async () => {
            try {
                await api('users/getTopInsideSquare?x1=-180&y1=-90&x2=180&y2=90&count=20')
                throw new Error('should not be hire')
            } catch (err) {
                expect(err).toBeInstanceOf(KopnikApiError)
                expect(err.code).toBe(401)
                expect(err).toMatchSnapshot()
            }
        })
    })
    describe('user1', () => {
        beforeAll(async () => {
            await login(1)
        })
        it('users/get?ids=', async () => {
            let result = await api('users/get?ids=')
            expect(result).toMatchSnapshot()
        })
        it('users/get?ids=1', async () => {
            let result = await api('users/get?ids=1')
            expect(result).toMatchSnapshot()
        })
        it('users/get?ids=2', async () => {
            let result = await api('users/get?ids=2')
            expect(result).toMatchSnapshot()
        })
        it('users/get?ids=3', async () => {
            let result = await api('users/get?ids=3')
            expect(result).toMatchSnapshot()
        })
        it('users/get?ids=4', async () => {
            let result = await api('users/get?ids=4')
            expect(result).toMatchSnapshot()
        })
        it('users/get?ids=1,2,3', async () => {
            let result = await api('users/get?ids=1,2,3')
            expect(result).toMatchSnapshot()
        })
        it('users/pending', async () => {
            let result = await api('users/pending')
            expect(result).toMatchSnapshot()
        })
    })
    /********************************************************
     * user_2_new
     *******************************************************/
    describe('user2', () => {
        beforeAll(async () => {
            await login(2)
        })
        it('users/get?ids=', async () => {
            let result = await api('users/get?ids=')
            expect(result).toMatchSnapshot()
        })
        it('users/get?ids=2', async () => {
            let result = await api('users/get?ids=2')
            expect(result).toMatchSnapshot()
        })
        it('users/pending', async () => {
            try {
                await api('users/pending')
                throw new Error('should not be hire')
            } catch (err) {
                expect(err).toBeInstanceOf(KopnikApiError)
                expect(err.code).toBe(403)
                expect(err).toMatchSnapshot()
            }
        })
        it('users/getTopInsideSquare?x1=-180&y1=-90&x2=180&y2=90&count=20', async () => {
            let result = await api('users/getTopInsideSquare?x1=-180&y1=-90&x2=180&y2=90&count=20')
            expect(result).toBeInstanceOf(Array)
            expect(result).toMatchSnapshot()
        })
    })
    /********************************************************
     * user_3_pending
     *******************************************************/
    describe('user3', () => {
        beforeAll(async () => {
            await login(3)
        })
        it('users/get?ids=', async () => {
            let result = await api('users/get?ids=')
            expect(result).toMatchSnapshot()
        })
        it('users/get?ids=3', async () => {
            let result = await api('users/get?ids=3')
            expect(result).toMatchSnapshot()
        })

        it('users/pending', async () => {
            try {
                await api('users/pending')
                throw new Error('should not be hire')
            } catch (err) {
                expect(err).toBeInstanceOf(KopnikApiError)
                expect(err.code).toBe(403)
                expect(err).toMatchSnapshot()
            }
        })
        it('users/getTopInsideSquare?x1=-180&y1=-90&x2=180&y2=90&count=20', async () => {
            let result = await api('users/getTopInsideSquare?x1=-180&y1=-90&x2=180&y2=90&count=20')
            expect(result).toBeInstanceOf(Array)
            expect(result).toMatchSnapshot()
        })
    })
    /********************************************************
     * user_4_declined
     *******************************************************/
    describe('user4', () => {
        beforeAll(async () => {
            await login(4)
        })
        it('users/get?ids=', async () => {
            let result = await api('users/get?ids=')
            expect(result).toMatchSnapshot()
        })
        it('users/get?ids=4', async () => {
            let result = await api('users/get?ids=4')
            expect(result).toMatchSnapshot()
        })

        it('users/pending', async () => {
            try {
                await api('users/pending')
                throw new Error('should not be hire')
            } catch (err) {
                expect(err).toBeInstanceOf(KopnikApiError)
                expect(err.code).toBe(403)
                expect(err).toMatchSnapshot()
            }
        })
        it('users/getTopInsideSquare?x1=-180&y1=-90&x2=180&y2=90&count=20', async () => {
            let result = await api('users/getTopInsideSquare?x1=-180&y1=-90&x2=180&y2=90&count=20')
            expect(result).toBeInstanceOf(Array)
            expect(result).toMatchSnapshot()
        })
    })
    /********************************************************
     * user_5_confirmed
     *******************************************************/
    describe('user5', () => {
        beforeAll(async () => {
            await login(5)
        })
        it('users/get?ids=', async () => {
            let result = await api('users/get?ids=')
            expect(result).toMatchSnapshot()
        })
        it('users/get?ids=5', async () => {
            let result = await api('users/get?ids=5')
            expect(result).toMatchSnapshot()
        })
        it('users/pending', async () => {
            try {
                await api('users/pending')
                throw new Error('should not be hire')
            } catch (err) {
                expect(err).toBeInstanceOf(KopnikApiError)
                expect(err.code).toBe(403)
                expect(err).toMatchSnapshot()
            }
        })
        it('users/getTopInsideSquare?x1=-180&y1=-90&x2=180&y2=90&count=20', async () => {
            let result = await api('users/getTopInsideSquare?x1=-180&y1=-90&x2=180&y2=90&count=20')
            expect(result).toBeInstanceOf(Array)
            expect(result).toMatchSnapshot()
        })
    })

    /********************************************************
     * user_6_foreman
     *******************************************************/
    describe('user6', () => {
        beforeAll(async () => {
            await login(6)
        })
        it('users/get?ids=', async () => {
            let result = await api('users/get?ids=')
            expect(result).toMatchSnapshot()
        })
        it('users/get?ids=6', async () => {
            let result = await api('users/get?ids=6')
            expect(result).toMatchSnapshot()
        })
        it('users/get?ids=7', async () => {
            let result = await api('users/get?ids=7')
            expect(result).toMatchSnapshot()
        })
        it('users/get?ids=8', async () => {
            let result = await api('users/get?ids=8')
            expect(result).toMatchSnapshot()
        })
        it('users/get?ids=9', async () => {
            let result = await api('users/get?ids=9')
            expect(result).toMatchSnapshot()
        })
        it('users/get?ids=10', async () => {
            let result = await api('users/get?ids=10')
            expect(result).toMatchSnapshot()
        })
        it('users/get?ids=11', async () => {
            let result = await api('users/get?ids=11')
            expect(result).toMatchSnapshot()
        })
        it('users/get?ids=12', async () => {
            let result = await api('users/get?ids=12')
            expect(result).toMatchSnapshot()
        })
        it('users/get?ids=13', async () => {
            let result = await api('users/get?ids=13')
            expect(result).toMatchSnapshot()
        })
        it('users/get?ids=14', async () => {
            let result = await api('users/get?ids=14')
            expect(result).toMatchSnapshot()
        })
        it('users/get?ids=15', async () => {
            let result = await api('users/get?ids=15')
            expect(result).toMatchSnapshot()
        })
    })
})

