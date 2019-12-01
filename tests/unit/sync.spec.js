import {sync, collection} from '../../src/models/decorators/sync'

@sync
class Kopnik {

  @collection ten= undefined

  constructor(id){
    this.id=id
    this.name= undefined
  }
}

describe('sync', () => {
  describe.skip('sync', () => {
    it('sync create reload method', () => {
      let kopnik = new Kopnik(1)

      // kopnik.reload()
      expect(kopnik).toHaveProperty("reload")
    })

    it('sync.reload() load data', async () => {
      let kopnik = new Kopnik(1)
      await kopnik.reload()
      expect(kopnik.name).toMatch(/\w+/)
    })

    it('sync.loaded load data', async () => {
      let kopnik = new Kopnik(1)
      await kopnik.loaded()
      expect(kopnik.name).toMatch(/\w+/)
    })

    it('sync loaded load once', async () => {
      let kopnik = new Kopnik(1)
      await kopnik.loaded()
      let name1 = kopnik.name
      await kopnik.loaded()
      expect(kopnik.name).toEqual(name1)
    })

    it.skip("twice loaded get same Promise", async () => {
      let kopnik = new Kopnik(1)
      expect(kopnik.loaded()).toBe(kopnik.loaded())
    })
  })

  describe('remote collection', () => {
    it('collection create loadName method',  () => {
      let kopnik= new Kopnik(1)

      expect(kopnik).toHaveProperty("getTen")
    })
    it('collection get data',  async () => {
      let kopnik= new Kopnik(1)
      let ten= await kopnik.getTen()
      expect(ten).toBeInstanceOf(Array)
    })

    it('collection create loadedName property',  () => {
      let kopnik= new Kopnik(1)
      expect(kopnik).toHaveProperty("loadedTen")
    })

    it('collection loaded getter',  async () => {
      let kopnik= new Kopnik(1)
      await kopnik.loadedTen
      expect(kopnik.ten).toBeInstanceOf(Array)
    })

    it('collection loaded getter load once',  async () => {
      let kopnik= new Kopnik(1)
      await kopnik.loadedTen
      expect(kopnik.ten).toEqual(await kopnik.loadedTen)
    })

    it.skip('debug',  () => {
      let kopnik= new Kopnik(1)
      kopnik.someMethod()
    })
  })
})