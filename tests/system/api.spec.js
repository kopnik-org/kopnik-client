import api from "../../src/api";
import {bottle, container} from "../../src/plugins/bottle";
import {KopnikApiError} from "../../src/KopnikError";

function login(id){
    return api('test/login/'+id)
}

describe('system api', () => {
    beforeEach(()=>{
        bottle.resetProviders(['cookieService'])
    })
    it('anonymous@users/get?ids=1', async () => {
        try {
            await api('users/get?ids=')
            throw new Error('should not be hire')
        }
        catch(err){
            expect(err.message).toContain('auth')
            expect(err).toBeInstanceOf(KopnikApiError)
        }
    })
    it('anonymous@test/login/1', async () => {
        let result = await login(1)
        expect(container.cookieService.cookie).toContain('PHPSESSID')
        expect(result).toMatchSnapshot()
    })
    it('user1@users/get?ids=', async () => {
        await login(1)
        let result = await api('users/get?ids=')
        expect(result).toMatchSnapshot()
    })
    it('user1@users/get?ids=1', async () => {
        await login(1)
        let result = await api('users/get?ids=1')
        expect(result).toMatchSnapshot()
    }) 
    it('user1@users/get?ids=2', async () => {
        await login(1)
        let result = await api('users/get?ids=2')
        expect(result).toMatchSnapshot()
    })
    it('user1@users/get?ids=3', async () => {
        await login(1)
        let result = await api('users/get?ids=3')
        expect(result).toMatchSnapshot()
    })
    it('user1@users/get?ids=4', async () => {
        await login(1)
        let result = await api('users/get?ids=4')
        expect(result).toMatchSnapshot()
    })
    it('user1@users/get?ids=1,2,3', async () => {
        await login(1)
        let result = await api('users/get?ids=1,2,3')
        expect(result).toMatchSnapshot()
    })

    /********************************************************
     * user_2_new
     *******************************************************/
    it('anonymous@test/login/2', async () => {
        let result = await login(2)
        expect(result).toMatchSnapshot()
    })
    it('user2@users/get?ids=', async () => {
        await login(2)
        let result = await api('users/get?ids=')
        expect(result).toMatchSnapshot()
    })
    it('user2@users/get?ids=2', async () => {
        await login(2)
        let result = await api('users/get?ids=2')
        expect(result).toMatchSnapshot()
    })

    /********************************************************
     * user_3_pending
     *******************************************************/
    it('anonymous@test/login/3', async () => {
        let result = await login(3)
        expect(result).toMatchSnapshot()
    })
    it('user3@users/get?ids=', async () => {
        await login(3)
        let result = await api('users/get?ids=')
        expect(result).toMatchSnapshot()
    })
    it('user3@users/get?ids=3', async () => {
        await login(3)
        let result = await api('users/get?ids=3')
        expect(result).toMatchSnapshot()
    })

    /********************************************************
     * user_4_pending
     *******************************************************/
    it('anonymous@test/login/4', async () => {
        let result = await login(4)
        expect(result).toMatchSnapshot()
    })
    it('user4@users/get?ids=', async () => {
        await login(4)
        let result = await api('users/get?ids=')
        expect(result).toMatchSnapshot()
    })
    it('user4@users/get?ids=4', async () => {
        await login(4)
        let result = await api('users/get?ids=4')
        expect(result).toMatchSnapshot()
    })

    /********************************************************
     * user_6_foreman
     *******************************************************/
    it('anonymous@test/login/6', async () => {
        let result = await login(6)
        expect(result).toMatchSnapshot()
    })
    it('user6@users/get?ids=', async () => {
        await login(6)
        let result = await api('users/get?ids=')
        expect(result).toMatchSnapshot()
    })
    it('user6@users/get?ids=6', async () => {
        await login(6)
        let result = await api('users/get?ids=6')
        expect(result).toMatchSnapshot()
    })
    it('user6@users/get?ids=7', async () => {
        await login(6)
        let result = await api('users/get?ids=7')
        expect(result).toMatchSnapshot()
    })
    it('user6@users/get?ids=8', async () => {
        await login(6)
        let result = await api('users/get?ids=8')
        expect(result).toMatchSnapshot()
    })
    it('user6@users/get?ids=9', async () => {
        await login(6)
        let result = await api('users/get?ids=9')
        expect(result).toMatchSnapshot()
    })
    it('user6@users/get?ids=10', async () => {
        await login(6)
        let result = await api('users/get?ids=10')
        expect(result).toMatchSnapshot()
    })
    it('user6@users/get?ids=11', async () => {
        await login(6)
        let result = await api('users/get?ids=11')
        expect(result).toMatchSnapshot()
    })
    it('user6@users/get?ids=12', async () => {
        await login(6)
        let result = await api('users/get?ids=12')
        expect(result).toMatchSnapshot()
    })
    it('user6@users/get?ids=13', async () => {
        await login(6)
        let result = await api('users/get?ids=13')
        expect(result).toMatchSnapshot()
    })
    it('user6@users/get?ids=14', async () => {
        await login(6)
        let result = await api('users/get?ids=14')
        expect(result).toMatchSnapshot()
    })
    it('user6@users/get?ids=15', async () => {
        await login(6)
        let result = await api('users/get?ids=15')
        expect(result).toMatchSnapshot()
    })
})

