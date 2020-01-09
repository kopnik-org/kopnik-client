import {KopnikApiError} from "../../src/KopnikError";
import {bottle, container} from "../../src/plugins/bottle";

import api from "../../src/api";

it('test/get&ids=', async () => {
    try {
        await api('test/login/1')
        let result = await api('users/get?ids=')
        // console.log(result)
    }
    catch(err) {
        console.log(err)
        expect(err).toBeInstanceOf(KopnikApiError)
        expect(err.message).toContain('auth')
    }
})
