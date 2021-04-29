import {bottle, container} from "../bottle/bottle";
import Locale from "./Locale";

describe('unit locales LocaleManager', () => {
  let localeManager

  beforeEach(() => {
    bottle.resetProviders(['localeManager'])
    localeManager = container.localeManager

    // гашу влияние локалстоража
    localeManager.currentLocale = 'ru'
  })

  it('present correct', async () => {
    expect(localeManager.currentLocale.name).toBe('ru')
    expect(localeManager.currentLocale.languageName).toBe('Русский')
  })
  it('set currentLocale en', async () => {
    localeManager.currentLocale = 'en'
    expect(localeManager.currentLocale).toBeInstanceOf(Locale)
  })
  it('set currentLocale {name: en}', async () => {
    localeManager.currentLocale = {name: 'en'}
    expect(localeManager.currentLocale).toBeInstanceOf(Locale)
  })
  it('set wrong locale', async () => {
    try {

      localeManager.currentLocale = {name: '666'}
      throw new Error(`should not be hire`)
    } catch (err) {
      expect(err.message).toContain('Wrong locale')
      expect(localeManager.currentLocale.name).toBe('ru')
    }
  })
})
