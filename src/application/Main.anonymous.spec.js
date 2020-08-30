import {bottle, container} from "../bottle/bottle";
import {AbstractSync, Kopnik} from "../models";
import {LatLng, LatLngBounds} from "leaflet";

// real fetch
container.constants.di.fetch = true

// раскомментировать когда будет возвращаться иной контент для Анонимуса
describe.skip('application Main', () => {
  let application, main, user, wrapper

  beforeEach(async () => {
    // сбросить cookieService, потому что кука тоже устанавливается
    bottle.resetProviders(['application','cookieService'])
    application = container.application
    main= application.sections.main
    application.user= null
  })

  it('loadTop20', async () => {
    main.map.bounds= new LatLngBounds(new LatLng(+40, +180),new LatLng(-40, -180))
    await main.loadTop20()
    expect(main.top20).toBeInstanceOf(Array)
    expect(main.top20.length).toBeFalsy()
  })
})

