import api from "../api";
import {bottle, container} from "../bottle/bottle";
import {KopnikApiError} from "../KopnikError";
import {AbstractSync, Kopnik} from "./index";
import {collection, object, scalar} from "../decorators/sync";
import reset from "../../tests/utils/reset";

// real fetch
container.constants.di.fetch = true

describe('models User api anonymous', () => {
  /** @type {Kopnik} */
  let main

  beforeEach(async () => {
    AbstractSync.clearCache()
    main = await Kopnik.create({}, 'main')
  })

  it('getEx', async () => {
    try {
      await main.reloadEx()
      throw new Error('should not be hire')
    } catch (err) {
      expect(err).toBeKopnikError(1401)
    }
  })

  it('get(self)', async () => {
    try {
      const user = new Kopnik()
      await user.reload()
      throw new Error('should not be hire')
    } catch (err) {
      expect(err).toBeKopnikError(1401)
    }
  })

  it('get(somebody)', async () => {
    try {
      // const somebody = await Kopnik.create()
      const user = await Kopnik.get(-1)
      throw new Error('should not be hire')
    } catch (err) {
      expect(err).toBeKopnikError(1401)
    }
  })
  it('users/pending', async () => {
    try {
      await main.reloadWitnessRequests()
      throw new Error('should not be hire')
    } catch (err) {
      expect(err).toBeKopnikError(1401)
    }
  })
  it('users/isMessagesFromGroupAllowed', async () => {
    try {
      let result = await main.isMessagesFromGroupAllowed()
      throw new Error('should not be hire')
    } catch (err) {
      expect(err).toBeKopnikError(1401)
    }
  })
  it('setLocale()', async () => {
    try {
      await main.setLocale('en')
      throw new Error("should not be hire")
    } catch (err) {
      expect(err).toBeKopnikError(1401)
    }
  })
  it('updateProfile()', async () => {
    try {
      await main.updateProfile({
        id: 2,
        status: 2,
        passport: '1234',
        location: {
          lat: 1,
          lng: 1
        },
      }, [])
      throw new Error("should not be hire")
    } catch (err) {
      expect(err).toBeKopnikError(1401)
    }
  })
  it('resolveWitnessRequest()', async () => {
    try {
      await main.resolveWitnessRequest({
        id: 1,
        status: 2,
      })
      throw new Error("should not be hire")
    } catch (err) {
      expect(err).toBeKopnikError(1401)
    }
  })
  describe('tree', () => {
    it('removeFromSubordinates()', async () => {
      try {
        await main.removeFromSubordinates(Kopnik.getReference(1))
        throw new Error("should not be hire")
      } catch (err) {
        expect(err).toBeKopnikError(1401)
      }
    })
  })
})

