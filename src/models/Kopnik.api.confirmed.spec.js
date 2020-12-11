import api from "../api";
import {bottle, container} from "../bottle/bottle";
import {KopnikApiError} from "../KopnikError";
import {AbstractSync, Kopa, Kopnik} from "./index";
import {collection, object, scalar} from "../decorators/sync";
import reset from "../../tests/utils/reset";

// real fetch
container.constants.di.fetch = true

describe('models User confirmed', () => {
  let main
  beforeEach(async () => {
    AbstractSync.clearCache()
    main = await Kopnik.create({
      status: Kopnik.Status.CONFIRMED,
    }, 'main')
    await main.login()
  })

  it('inviteKopa', async () => {
    const kopa = new Kopa()
    kopa.subject= 'test kopa'
    kopa.participants=[await Kopnik.create({}, 'participant')]
    const inviteLink = await main.inviteKopa(kopa)
    expect(inviteLink).toBeTruthy()
  })
  it('get(self)', async () => {
    const user = new Kopnik()
    await user.reload()
    expect(user.id).toBe(main.id)
  })
  it('get(somebody)', async () => {
    const somebody = await Kopnik.create()
    const user = await Kopnik.get(somebody.id)
    expect(user.id).toBe(somebody.id)
  })
  it('reloadWitnessRequests()', async () => {
      await main.reloadWitnessRequests()
      expect(main.witnessRequests).toEqual([])
  })
  it('isMessagesFromGroupAllowed()', async () => {
    let result = await main.isMessagesFromGroupAllowed()
  })
  it('setLocale()', async () => {
    await main.setLocale({name: 'en'})
    await main.reload()
    expect(main.locale).toMatchObject({name: "en"})
  })
  it('updateProfile()', async () => {
    const witness = await Kopnik.create({
      isWitness: true,
    }, 'witness')
    const state = {
      role: Kopnik.Role.Female,
      passport: '0001',
      location: {
        lat: 1,
        lng: 1
      },
      firstName: '1',
      lastName: '2',
      patronymic: '3',
      birthYear: 2000,
      locale: 'en',
    }
    await main.updateProfile(state)

    await main.login()
    await main.reload()
    expect(main.status).toBe(Kopnik.Status.PENDING)
    expect(main.plain).toMatchObject(state)
  })

  describe('tree', () => {
    describe('putForemanRequest()', () => {
      it('success', async () => {
        const foreman = await Kopnik.create({}, 'foreman')
        foreman.foremanRequests = []

        await main.putForemanRequest(foreman)
        await main.reload()
        expect(main.foremanRequest).toBe(foreman)
        expect(foreman.foremanRequests).toHaveLength(1)
        expect(foreman.foremanRequests[0]).toBe(main)
      })
      it('success when in other ten, then reset foreman', async () => {
        const foreman1 = await Kopnik.create({}, 'foreman')
        const foreman2 = await Kopnik.create({}, 'foreman')

        // подал заявку 1
        await main.putForemanRequest(foreman1)
        await main.logout()

        // одобряем заявку 1
        await foreman1.login()
        await foreman1.confirmForemanRequest(main)
        await foreman1.logout()

        // подаем заявку 2
        await main.login()
        await main.putForemanRequest(foreman2)

        // проверяем что в этом момент старшина 1 отвалился
        await main.reload()
        expect(main.foreman).toBeNull()
      })
      it('success reset', async () => {
        const foreman = await Kopnik.create({}, 'foreman')
        foreman.foremanRequests = []

        await main.putForemanRequest(foreman)
        await main.putForemanRequest(null)
        await main.reload()
        expect(main.foremanRequest).toBeNull()
        expect(foreman.foremanRequests).toHaveLength(0)
      })

      it('woman', async () => {
        const woman = await Kopnik.create({
          role: Kopnik.Role.Female
        }, 'female')
        try {
          await main.putForemanRequest(woman)
          throw new Error("should not be hire")
        } catch (err) {
          expect(err).toBeKopnikError(1000 + 510)
        }
      })
    })
    it('getForemanRequests()', async () => {
      const requester = await Kopnik.create({
        foremanRequest_id: main.id,
      }, 'requester')
      await main.reloadForemanRequests()
      expect(main.foremanRequests).toBeInstanceOf(Array)
      expect(main.foremanRequests).toHaveLength(1)
      expect(main.foremanRequests[0].id).toBe(requester.id)
    })
    describe('confirmForemanRequest()', () => {
      it('success', async () => {
        const requester = await Kopnik.create({
          foremanRequest_id: main.id,
        }, 'requester')
        await main.confirmForemanRequest(requester)
        expect(main.rank).toBe(2)

        await main.reloadForemanRequests()
        expect(main.foremanRequests).toBeInstanceOf(Array)
        expect(main.foremanRequests).toHaveLength(0)

        await main.reloadSubordinates()
        expect(main.subordinates).toBeInstanceOf(Array)
        expect(main.subordinates).toHaveLength(1)

        await main.reload()
        expect(main.rank).toBe(2)
        expect(main.tenChatInviteLink).toBeTruthy()

        await main.logout()
        await requester.login()
        await requester.reload()
        expect(requester.foremanRequest).toBeNull()
        expect(requester.foreman).toBe(main)

        await main.reload()
        expect(main.tenChatInviteLink).toBeTruthy()
      })
      it('not found', async () => {
        const foreman = await Kopnik.create({
          foremanRequest_id: main.id,
        }, 'foreman')
        const somebody = await Kopnik.create({
          status: Kopnik.Status.PENDING,
          foremanRequest_id: foreman.id,
        }, 'somebody')

        try {
          await main.confirmForemanRequest(somebody)
          throw new Error("should not be hire")
        } catch (err) {
          expect(err).toBeKopnikError(1000 + 511)
        }
      })
    })
    describe('declineForemanRequest()', () => {
      it('success', async () => {
        const requester = await Kopnik.create({
          status: Kopnik.Status.CONFIRMED,
          foremanRequest_id: main.id,
        }, 'requester')
        await main.declineForemanRequest(requester)

        await main.reloadForemanRequests()
        expect(main.foremanRequests).toBeInstanceOf(Array)
        expect(main.foremanRequests).toHaveLength(0)

        await main.logout()
        await requester.login()
        await requester.reload()
        expect(requester.foremanRequest).toBeNull()
        expect(requester.foreman).toBeNull()
      })
      it('not found', async () => {
        const foreman = await Kopnik.create({
          foremanRequest_id: main.id,
        }, 'foreman')
        const somebody = await Kopnik.create({
          status: Kopnik.Status.PENDING,
          foremanRequest_id: foreman.id,
        }, 'somebody')

        try {
          await main.declineForemanRequest(somebody)
          throw new Error("should not be hire")
        } catch (err) {
          expect(err).toBeKopnikError(1000 + 511)
        }
      })
    })
    it('getForeman()', async () => {
      const subordinate = await Kopnik.create({
        foreman_id: main.id,
      }, 'subordinate')
      await subordinate.reload()
      expect(subordinate.foreman).toBe(main)
    })
    it.skip('getAllForemans()', async () => {
      const subordinate = await Kopnik.create({
        foreman_id: main.id,
      }, 'subordinate')
      const subsub = await Kopnik.create({
        foreman_id: subordinate.id,
      }, 'subsub')
      const foremans = await subsub.getAllForemans()
      expect(foremans[o]).toBe(subordinate)
      expect(foremans[0]).toBe(main)
    })
    it('loadedSubordinates()', async () => {
      const subordinate = await Kopnik.create({
        foreman_id: main.id,
      }, 'subordinate')

      const subordinated = await main.loadedSubordinates()
      expect(subordinated).toBeInstanceOf(Array)
      expect(subordinated).toHaveLength(1)
      expect(subordinated[0]).toBe(subordinate)
    })
    describe('removeFromSubordinates()', () => {
      it('success', async () => {
        const subordinate = await Kopnik.create({
          foreman_id: main.id,
        }, 'subordinate')
        await main.reload()
        await main.removeFromSubordinates(subordinate)

        // проверяем уменьшение ранга на клиенте
        expect(main.rank).toBe(1)

        await main.reloadSubordinates()
        expect(main.subordinates).toHaveLength(0)

        // проверяем уменьшение ранга на сервере
        await main.reload()
        expect(main.rank).toBe(1)
        await subordinate.reload()
        expect(subordinate.foreman).toBeNull()
      })
      it('not found', async () => {
        const foreman = await Kopnik.create({}, 'foreman')
        const somebody = await Kopnik.create({
          foreman_id: foreman.id,
        }, 'somebody')

        try {
          await main.removeFromSubordinates(somebody)
          throw new Error("should not be hire")
        } catch (err) {
          expect(err).toBeKopnikError(1000 + 512)
        }
      })
    })
    describe('resetForeman()', () => {
      it('self reset success', async () => {
        const subordinate = await Kopnik.create({
          foreman_id: main.id,
        }, 'subordinate')
        await main.reload()
        await main.logout()
        await subordinate.login()
        await subordinate.resetForeman()

        // проверяем изменения на клиенте
        expect(main.rank).toBe(1)
        expect(subordinate.foreman).toBeNull()

        // проверяю изменения на сервере
        await subordinate.reload()
        await main.reload()
        await main.reloadSubordinates()
        expect(subordinate.foreman).toBeNull()
        expect(main.rank).toBe(1)
        expect(main.subordinates).toEqual([])
      })
      it('self reset when foreman not setted', async () => {
        await main.resetForeman()
        await main.reload()
        expect(main.foreman).toBeNull()
      })
    })
  })
})
