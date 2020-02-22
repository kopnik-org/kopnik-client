import api from "../../../src/api";

/**
 * Реализация без участия контейнера
 * @param id
 * @returns {Promise<*|undefined>}
 */
function login(id) {
    return api('test/login/' + id)
}

describe('system errors', ()=>{
    it('logout', async () => {
        await login(1)
        let result = await api('logout')
    })
})

