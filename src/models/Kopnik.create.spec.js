import api from "../api";
import {bottle, container} from "../bottle/bottle";
import {KopnikApiError} from "../KopnikError";
import {AbstractSync, Kopnik} from "./index";
import {collection, object, scalar} from "../decorators/sync";
import reset from "../../tests/utils/reset";

// real fetch
container.constants.di.fetch = true

describe('models User', () => {
    it('create()', async () => {
        const user= await Kopnik.create()
        expect(user.id).toBeTruthy()
        expect(user).toBe(Kopnik.getReference(user.id))
        await user.login()
        await user.reload()
        expect(user.status).toBe(Kopnik.Status.CONFIRMED)
    })

    it.skip('create with witness_id', async () => {
        const witness= await Kopnik.create({
            isWitness: true,
        }, 'witness')
        const pending= await Kopnik.create({
            witness_id: witness.id
        })

        await witness.login()
        await witness.reload()
        expect(witness.isWitness).toBeTruthy()

        await pending.reload()
        expect(pending.witness_id).toBe(witness.id)
    })
})
