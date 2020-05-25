import api from "../api";
import {bottle, container} from "../bottle/bottle";
import {KopnikApiError} from "../KopnikError";
import {AbstractSync, Kopnik} from "./index";
import {collection, object, scalar} from "../decorators/sync";
import reset from "../../tests/utils/reset";

// real fetch
container.config.di.fetch = true

describe('models User api anonymous', () => {
    /** @type {Kopnik} */
    let main

    beforeEach(async () => {
        main = await Kopnik.create({
        }, 'main')
        AbstractSync.clearCache()
    })

    it('get(self)', async () => {
        try {
            const user = new Kopnik()
            await user.reload()
            throw new Error('should not be hire')
        } catch (err) {
            expect(err.code).toBe(401)
        }
    })

    it('get(somebody)', async () => {
        try {
            const somebody = await Kopnik.create()
            const user = await Kopnik.get(somebody.id)
            throw new Error('should not be hire')
        } catch (err) {
            expect(err.code).toBe(401)
        }
    })
    it('users/pending', async () => {
        try {
            await main.reloadWitnessRequests()
            throw new Error('should not be hire')
        } catch (err) {
            expect(err.code).toBe(401)
        }
    })
    it('users/isMessagesFromGroupAllowed', async () => {
        try {
            let result = await main.isMessagesFromGroupAllowed()
            throw new Error('should not be hire')
        } catch (err) {
            expect(err.code).toBe(401)
        }
    })
    it('setLocale()', async () => {
        try {
            await main.setLocale('en')
            throw new Error("should not be hire")
        } catch (err) {
            expect(err.code).toBe(401)
        }
    })
    it('updateProfile()', async () => {
        try {
            await main.update({
                id: 2,
                status: 2,
                passport: '1234',
                location: {
                    lat: 1,
                    lng: 1
                },
            })
            throw new Error("should not be hire")
        } catch (err) {
            expect(err.code).toBe(401)
        }
    })
    it('updateWitnessRequestStatus()', async () => {
        try {
            await main.updateWitnessRequestStatus({
                id: 1,
                status: 2,
            })
            throw new Error("should not be hire")
        } catch (err) {
            expect(err.code).toBe(401)
        }
    })
})

