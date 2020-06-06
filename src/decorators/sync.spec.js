import {sync, collection, scalar} from './sync'

@sync
class Kopnik {

  @scalar firstname
  @collection ten= undefined

  constructor(id){
    this.id=id
    this.name= undefined
  }
}

describe('sync', () => {
  describe('sync', () => {
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

    it("twice loaded getInstance same Promise", async () => {
      let kopnik = new Kopnik(1)
      expect(kopnik.loaded()).toBe(kopnik.loaded())
    })
  })
  describe('scalar', () => {
    it('@scalar add static field sclars', () => {
      let kopnik= new Kopnik()
      let descriptor= Object.getOwnPropertyDescriptor(kopnik,"firstname")
      expect(Kopnik.scalars).toBeInstanceOf(Array)
    })
  })
  describe('remote collection', () => {
    it('collection create loadName method',  () => {
      let kopnik= new Kopnik(1)

      expect(kopnik).toHaveProperty("getTen")
    })
    it('collection getInstance data',  async () => {
      let kopnik= new Kopnik(1)
      let ten= await kopnik.getTen()
      expect(ten).toBeInstanceOf(Array)
    })

    it('collection create loadedName property',  () => {
      let kopnik= new Kopnik(1)
      expect(kopnik).toHaveProperty("loadedTen")
    })

    it.skip('collection loaded getter',  async () => {
      let kopnik= new Kopnik(1)
      await kopnik.loadedTen
      expect(kopnik.ten).toBeInstanceOf(Array)
    })

    it.skip('collection loaded getter load once',  async () => {
      let kopnik= new Kopnik(1)
      await kopnik.loadedTen
      expect(kopnik.ten).toEqual(await kopnik.loadedTen)
    })

/*    it('debug',  () => {
      let kopnik= new Kopnik(1)
      kopnik.someMethod()
    })*/
  })
})
