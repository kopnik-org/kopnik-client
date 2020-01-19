import mapi from "../../src/mapi";
import {bottle, container} from "../../src/plugins/bottle";
import {getData} from "../../src/mapi/mapi";


describe('unit mapi', () => {
    describe('base', () => {
        it('getData', ()=>{
            const mapiData=getData()
            expect(mapiData).toBeInstanceOf(Object)
        })
    })

    describe('do', () => {
        beforeEach(() => {
            bottle.resetProviders(['cookieService'])
        })
        it('anonymous@test/login/1', async () => {
            let result = await mapi('test/login/1')
            expect(container.cookieService.cookie).toBe('user1')
        });
        it('user1@users/get?ids=', async () => {
            await login(1)
            let result = await mapi('users/get?ids=')
        });
        it('user1@users/get?ids=2', async () => {
            await login(1)
            let result = await mapi('users/get?ids=2')
        });
        it('user1@users/get?ids=1,2,3', async () => {
            await login(1)
            let result = await mapi('users/get?ids=1,2,3')
        })
    })
})
