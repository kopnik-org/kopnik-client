import api from "../api";
import {bottle, container} from "../bottle/bottle";
import {KopnikApiError} from "../KopnikError";
import {AbstractSync, Kopnik} from "./index";
import {collection, object, scalar} from "../decorators/sync";
import reset from "../../tests/utils/reset";

// real fetch
container.constants.di.fetch = true

describe('models User create', () => {
  it('scalar', async () => {
    const user = await Kopnik.create({
      isWitness: true,
    })
    expect(user.id).toBeTruthy()
    expect(user).toBe(Kopnik.getReference(user.id))
    await user.login()
    await user.reload()
    expect(user.isWitness).toBeTruthy()
    expect(user.status).toBe(Kopnik.Status.CONFIRMED)
  })

  it('relation', async () => {
    const witness = await Kopnik.create({
      isWitness: true,
    }, 'witness')
    const pending = await Kopnik.create({
      witness: witness
    }, 'pending')

    await pending.login()
    await pending.reload()
    expect(pending.witness).toBe(witness)
  })
})
