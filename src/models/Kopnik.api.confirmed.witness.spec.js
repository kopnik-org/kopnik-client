import api from "../api";
import {bottle, container} from "../bottle/bottle";
import {KopnikApiError} from "../KopnikError";
import {AbstractSync, Kopnik} from "./index";
import {collection, object, scalar} from "../decorators/sync";
import reset from "../../tests/utils/reset";

// real fetch
container.config.di.fetch = true

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

        await main.reloadWitnessRequests()
        expect(main.witnessRequests).toBeInstanceOf(Array)
        expect(main.witnessRequests).toHaveLength(1)
        expect(main.witnessRequests[0].id).toBe(pending.id)
        expect(main.witnessRequests[0].passport).toBeTruthy()
    })

    it('updateWitnessRequestStatus()', async () => {
        const pending = await Kopnik.create({
            status: Kopnik.Status.PENDING,
            witness_id: main.id,
        })
        await main.updateWitnessRequestStatus({
            id: pending.id,
            status: Kopnik.Status.CONFIRMED,
        })
        await pending.reload()
        expect(pending.status).toBe(Kopnik.Status.CONFIRMED)
    })
    it('updateWitnessRequestStatus() not found', async () => {
        const somebody = await Kopnik.create({
            status: Kopnik.Status.PENDING,
        })
        try {
            await main.updateWitnessRequestStatus({
                id: somebody.id,
                status: Kopnik.Status.CONFIRMED,
            })
            throw new Error("should not be hire")
        } catch (err) {
            expect(err).toBeKopnikError('Pending user not found')
        }
    })
})
