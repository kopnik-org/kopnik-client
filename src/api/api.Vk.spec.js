import {KopnikApiError} from "../KopnikError";
import {bottle, container} from "../bottle/bottle";

import api from "./index";

describe('api/Vk', () => {
    it('/test/sendVkMessage', async () => {
        await api('test/sendVkMessage',)
    })
    it('/test/createVkChat', async () => {
        await api('test/createVkChat',)
    })
})

