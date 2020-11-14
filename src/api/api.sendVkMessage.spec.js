import {KopnikApiError} from "../KopnikError";
import {bottle, container} from "../bottle/bottle";

import api from "./index";

describe('api', () => {
    it('/test/sendVkMessage', async () => {
        await api('test/sendVkMessage',)
    })
})

