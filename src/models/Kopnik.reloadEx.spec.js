import {Kopnik} from "./index";
import {bottle, container} from "../bottle/bottle";
import {KopnikApiError} from "../KopnikError";
import Locale from "../locales/Locale";
import LocaleManager from "../locales/LocaleManager";

describe('models Kopnik reloadEx', () => {
  /** @type {Kopnik} */
  let main
  beforeEach(() => {
    main = new Kopnik()
    Kopnik.clearCache()
    fetch.resetMocks()
  })

  it('excluded by foreman', async () => {
    const foreman = await Kopnik.create({
      isLoaded: true
    }, 'foreman')
    main.foreman = foreman
    foreman.subordinates = [main]

    fetch.mockIfEx(/getEx/, {
      id: main.id,
      foreman_id: null,
      subordinates:[],
      foremanRequests:[],
    })
    await main.reloadEx()
    expect(main.foreman).toBeNull()
    expect(foreman.subordinates).toHaveLength(0)
  })

  it('left by subordinate', async () => {
    const subordinate = await Kopnik.create({
      isLoaded: true
    }, 'subordinate')
    main.subordinates = [subordinate]
    subordinate.foreman = main

    fetch.mockIfEx(/getEx/, {
      id: main.id,
      foreman_id: null,
      subordinates:[],
      foremanRequests:[],
    })
    await main.reloadEx()
    expect(main.subordinates).toHaveLength(0)
    expect(subordinate.foreman).toBeNull()
  })

  it.only('left by foreman request', async () => {
    const requester = await Kopnik.create({
      isLoaded: true
    }, 'requester')
    main.foremanRequests = [requester]
    requester.foremanRequest = main

    fetch.mockIfEx(/getEx/, {
      id: main.id,
      subordinates:[],
      foremanRequests:[],
    })
    await main.reloadEx()
    expect(main.foremanRequests).toHaveLength(0)
    expect(requester.foremanRequest).toBeNull()
  })

  it('error on collection', async () => {
    const subordinate = await Kopnik.create({
      isLoaded: true
    }, 'subordinate')
    main.subordinates = [subordinate]
    main.foremanRequests = [subordinate]
    main.witnessRequests = [subordinate]

    fetch.mockIfEx(/getEx/, {
      id: main.id,
      foreman_id: null,
      subordinates:{},
      foremanRequests:{},
      witnessRequests:{},
    })
    await main.reloadEx()
    expect(main.subordinates).toBeUndefined()
    expect(main.foremanRequests).toBeUndefined()
    expect(main.witnessRequests).toBeUndefined()
  })
})
