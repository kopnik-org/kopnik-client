import api from "../api";
import {bottle, container} from "../bottle/bottle";
import {KopnikApiError} from "../KopnikError";
import {AbstractSync, Kopnik} from "./index";
import {collection, object, scalar} from "../decorators/sync";
import reset from "../../tests/utils/reset";

// real fetch
container.constants.di.fetch = true

describe('models User get confirmed witness', () => {
  /** @type {Kopnik} */
  let main

  beforeEach(async () => {
    AbstractSync.clearCache()
    main = await Kopnik.create({
      status: Kopnik.Status.CONFIRMED,
      isWitness: true,
    }, 'witness')
    await main.login()
  })

  /**
   * main - это старшина в данном тесте
   * user - это текущий пользователь
   */
  it('getEx', async () => {
    const user = await Kopnik.create({
      status: Kopnik.Status.CONFIRMED,
      foreman_id: main.id,
      isWitness: true,
    }, 'user')

    const subordinate = await Kopnik.create({
      status: Kopnik.Status.CONFIRMED,
      foreman_id: user.id,
    }, 'subordinate')

    const requester = await Kopnik.create({
      status: Kopnik.Status.CONFIRMED,
      foremanRequest_id: user.id,
    }, 'requester')

    const witnesser = await Kopnik.create({
      status: Kopnik.Status.PENDING,
      witness_id: user.id,
    }, 'witnesser')

    await user.login()
    await user.reloadWitnessRequests()
    await user.reloadEx()
    expect(user.foreman).toBe(main)
    expect(user.subordinates[0]).toBe(subordinate)
    expect(user.foremanRequests[0]).toBe(requester)
    expect(user.witnessRequests[0]).toBe(witnesser)
  })

  it('reloadWitnessRequests()', async () => {
    const pending = await Kopnik.create({
      status: Kopnik.Status.PENDING,
      witness_id: main.id,
    }, 'pending')

    // those 3 should not be returned
    await Kopnik.create({
      status: Kopnik.Status.CONFIRMED,
      witness_id: main.id,
    })
    await Kopnik.create({
      status: Kopnik.Status.DECLINED,
      witness_id: main.id,
    })
    await Kopnik.create({
      status: Kopnik.Status.NEW,
    })

    Kopnik.clearCache()
    await main.reloadWitnessRequests()
    expect(main.witnessRequests).toBeInstanceOf(Array)
    expect(main.witnessRequests).toHaveLength(1)
    expect(main.witnessRequests[0].id).toBe(pending.id)
    expect(main.witnessRequests[0].passport).toBeTruthy()
  })

  it('resolveWitnessRequest()', async () => {
    const pending = await Kopnik.create({
      status: Kopnik.Status.PENDING,
      witness_id: main.id,
    })
    await main.resolveWitnessRequest({
      id: pending.id,
      status: Kopnik.Status.CONFIRMED,
    })
    await pending.reload()
    expect(pending.status).toBe(Kopnik.Status.CONFIRMED)
  })
  it('resolveWitnessRequest() not found', async () => {
    const somebody = await Kopnik.create({
      status: Kopnik.Status.PENDING,
    })
    try {
      await main.resolveWitnessRequest({
        id: somebody.id,
        status: Kopnik.Status.CONFIRMED,
      })
      throw new Error("should not be hire")
    } catch (err) {
      expect(err).toBeKopnikError('Pending user not found')
    }
  })
})
