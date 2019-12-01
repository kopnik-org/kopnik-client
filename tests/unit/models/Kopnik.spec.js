require('isomorphic-fetch');

import * as models from "../../../src/models";



describe('kopnik', () => {
  it('Kopnik.loaded',  async () => {
    let kopnik1= models.Kopnik.getReference(1)
    await kopnik1.loaded()

    expect(kopnik1.isLoaded).toBeTruthy()
    expect(kopnik1.name).toMatch(/\w+/)
  })

  it('Kopnik.list',  async () => {
    let result=await models.Kopnik.list()

    expect(result).toBeInstanceOf(Array)
  })
})