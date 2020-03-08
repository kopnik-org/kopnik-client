import {bottle, container} from "../../../src/bottle/bottle";
import Locale from "../../../src/locales/Locale";

describe('unit locales LocaleManager', () => {
    let localeManager

    beforeEach(() => {
        bottle.resetProviders(['localeManager'])
        localeManager= container.localeManager
    })

    it('present correct', async () => {
        expect(localeManager.currentLocale.name).toBe('ru')
        expect(localeManager.currentLocale.languageName).toBe('Русский')
    })
    it('set currentLocale en', async () => {
        localeManager.currentLocale= 'en'
        expect(localeManager.currentLocale).toBeInstanceOf(Locale)
    })
    it('set currentLocale {name: en}', async () => {
        localeManager.currentLocale= {name: 'en'}
        expect(localeManager.currentLocale).toBeInstanceOf(Locale)
    })
    it('set wrong locale', async () => {
        try{
            localeManager.currentLocale= {name: '666'}
            throw new Error(`should not be hire`)
        }
        catch(err){
            expect(err.message).toContain('Wrong locale')
            expect(localeManager.currentLocale.name).toBe('ru')
        }
    })
})
