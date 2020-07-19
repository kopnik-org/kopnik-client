import {KopnikApiError} from "../KopnikError";
import {bottle, container} from "../bottle/bottle";

import api from "./index";

describe('system errors', ()=>{
    it.skip('/api/error', async () => {
        try {
            await api('error')
            throw new Error('should not be hire')
        }
        catch(err) {
            expect(err).toBeInstanceOf(KopnikApiError)
            expect(err.message).toContain('Я тестовая ошибка')
            expect(err.code).toContain('100010')
        }
    })
    it('/api/unknown method', async () => {
        try {
            await api('unknownMethod')
            throw new Error('should not be hire')
        }
        catch(err) {
            console.log(err)
            expect(err).toBeInstanceOf(KopnikApiError)
            expect(err.message).toContain('unknown')
        }
    })
    it('/api/bodyError', async () => {
        try {
            await api('bodyError',{
                body:{
                    array:{a:1, b:2}
                }
            })
            throw new Error('should not be hire')
        }
        catch(err) {
            console.log(err)
            expect(err).toBeInstanceOf(KopnikApiError)
        }
    })
})

