import api from "./index";

/**
 * Реализация без участия контейнера
 * @param id
 * @returns {Promise<*|undefined>}
 */
function login(id) {
    return api('test/login/' + id)
}

describe.skip('system api', ()=>{
    it('logout', async () => {
        await login(1)
        let result = await api('logout')
    })
})

