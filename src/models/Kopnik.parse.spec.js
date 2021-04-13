import {Kopnik} from "./index";
import Locale from "../locales/Locale";
import LocaleManager from "../locales/LocaleManager";
import parse from "@/models/utils/parse";

describe('models Kopnik parse', () => {
  it('locale', async () => {
    const parsed = parse(Kopnik,{locale: 'ru'})
    expect(parsed.locale).toBeInstanceOf(Locale)
    expect(parsed.locale.name).toBeInstanceOf('ru')
  })

  describe('scalar', () => {
    it('number', () => {
      const parsed = parse(Kopnik,{rank: 2})
      expect(parsed.rank).toBe(2)
    })
    it('undefined', () => {
      const parsed = parse(Kopnik,{rank: undefined})
      expect(parsed.rank).toBeUndefined()
    })
    it('null', () => {
      const parsed = parse(Kopnik,{rank: null})
      expect(parsed.rank).toBeNull()
    })
  })

  describe('relation', () => {
    it('object', async () => {
      const parsed = parse(Kopnik,{
        foreman: {
          id: 777
        }
      })
      expect(parsed.foreman).toBeInstanceOf(Kopnik)
      expect(parsed.foreman.id).toBe(777)
      expect(parsed.foreman.isLoaded).toBeTruthy()
      expect(parsed.foreman).toBe(Kopnik.getReference(777))
    })
    it('object isLoaded=false', async () => {
      const parsed = parse(Kopnik,{
        foreman: {
          id: 777,
          isLoaded: false,
        }
      })
      expect(parsed.foreman).toBeInstanceOf(Kopnik)
      expect(parsed.foreman.id).toBe(777)
      expect(parsed.foreman.isLoaded).toBeFalsy()
    })
    it('scalar', async () => {
      const parsed = parse(Kopnik,{
        foreman: 777,
      })
      expect(parsed.foreman).toBeInstanceOf(Kopnik)
      expect(parsed.foreman.id).toBe(777)
      expect(parsed.foreman.isLoaded).toBeFalsy()
    })
    it('undefined', async () => {
      const parsed = parse(Kopnik,{foreman: undefined})
      expect(parsed.foreman).toBeUndefined()
    })
    it('null', async () => {
      const parsed = parse(Kopnik,{foreman: null})
      expect(parsed.foreman).toBeNull()
    })
  })

  describe('relation[]', () => {
    it('object[]', async () => {
      const parsed = parse(Kopnik,{
        subordinates: [{
          id: 777
        }]
      })
      expect(parsed.subordinates[0]).toBeInstanceOf(Kopnik)
      expect(parsed.subordinates[0].id).toBe(777)
      expect(parsed.subordinates[0].isLoaded).toBeTruthy()
    })
    it('object[] isLoaded=false', async () => {
      const parsed = parse(Kopnik,{
        subordinates: [{
          id: 777,
          isLoaded: false,
        }]
      })
      expect(parsed.subordinates[0]).toBeInstanceOf(Kopnik)
      expect(parsed.subordinates[0].id).toBe(777)
      expect(parsed.subordinates[0].isLoaded).toBeFalsy()
    })
    it('scalar', async () => {
      const parsed = parse(Kopnik,{
        subordinates: [777],
      })
      expect(parsed.subordinates[0]).toBeInstanceOf(Kopnik)
      expect(parsed.subordinates[0].id).toBe(777)
      expect(parsed.subordinates[0].isLoaded).toBeFalsy()
    })
    it('undefined', async () => {
      const parsed = parse(Kopnik,{subordinates: undefined})
      expect(parsed.subordinates).toBeUndefined()
    })
    it('null', async () => {
      expect.assertions(1)
      try {
        parse(Kopnik,{subordinates: null})
      } catch (err) {
        expect(err).toBeInstanceOf(Error)
      }
    })
  })
})
