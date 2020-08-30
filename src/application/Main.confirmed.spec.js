import {bottle, container} from "../bottle/bottle";
import {AbstractSync, Kopnik} from "../models";
import {LatLng, LatLngBounds} from "leaflet";
import flushPromises from "flush-promises/index";
import fetchMock from "jest-fetch-mock";


describe('application Main api confirmed', () => {
  let application, main, user, wrapper, getTopInsideSquare, get

  beforeEach(async () => {
    // сбросить cookieService, потому что кука тоже устанавливается
    bottle.resetProviders(['application','cookieService'])
    AbstractSync.clearCache()
    application = container.application
    main= application.sections.main
    user = await Kopnik.create({
        status: Kopnik.Status.NEW,
        isLoaded: true,
      },
      'user'
    )
    fetch.resetMocks()
    // fetch.mockIfExx(/ids=$/, [user.plain])
    // fetch.mockIfExx(/idsssss$/, [user.plain])
    fetchMock.mockIf(/ids=$/, async ()=>{
      return JSON.stringify([user.plain])
    })
    fetchMock.mockIf(/getTopInsideSquare/, async ()=>{
      return JSON.stringify([user.plain])
    })
    // fetch.mockIfExx( /getTopInsideSquare/, [user.plain])
    await application.authenticate()
    await flushPromises()
  })

  it('loadTop20 cancel', async () => {
    let canceledTop20

    main.top20=[]
    main.loadTop20()
      .then(response=>{
        canceledTop20= JSON.parse(JSON.stringify(main.top20))
      })
    await main.loadTop20()
    expect(canceledTop20).toEqual([])
    expect(main.top20).toEqual([user])
  })
})

