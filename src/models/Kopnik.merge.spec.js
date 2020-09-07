import {Kopnik} from "./index";
import {bottle, container} from "../bottle/bottle";
import {KopnikApiError} from "../KopnikError";
import Locale from "../locales/Locale";
import LocaleManager from "../locales/LocaleManager";

describe('models Kopnik merge', () => {
  /** @type {Kopnik} */
  let main
  beforeEach(() => {
    main = new Kopnik()
    Kopnik.clearCache()
  })
  it('merge locale', async () => {
    main.merge({locale: 'ru', rank: 2})
    expect(main.locale).toBeInstanceOf(Locale)
  })
  it('merge locale', async () => {
    main.merge({locale: new LocaleManager().currentLocale})
    expect(main.locale).toBeInstanceOf(Locale)
  })
  it('merge rank', async () => {
    main.merge({rank: 2})
    expect(main.rank).toBe(2)
  })
})
