import {bottle, container} from "../bottle/bottle";
import {AbstractSync, Kopnik} from "../models";
import {LatLng, LatLngBounds} from "leaflet";
import fetchMock from "jest-fetch-mock";
import flushPromises from "flush-promises/index";


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
    application.user= user
    fetch.mockIfEx(/ids=$/, [user.plain])
    fetch.mockIfEx( /getTopInsideSquare/, [user.plain])
    await flushPromises()
  })

  // вернуть когда AbortController заработает в Jest
  it('loadTop20 CancelSignal', async () => {
    let canceledTop20=43234

    main.map.bounds= new LatLngBounds(new LatLng(0,0), new LatLng(1,1))
    // expect.assertions(1);
    main.loadTop20()
      .then(response=>canceledTop20= JSON.parse(JSON.stringify(main.top20)))
    await main.loadTop20()
    expect(canceledTop20).toEqual([])
    expect(main.top20).toEqual([user])
  })
})

