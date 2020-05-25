import api from "../api";
import {bottle, container} from "../bottle/bottle";
import {KopnikApiError} from "../KopnikError";
import {AbstractSync, Kopnik} from "./index";
import {collection, object, scalar} from "../decorators/sync";
import reset from "../../tests/utils/reset";

// real fetch
container.config.di.fetch = true

describe('models User get common', () => {
    let main
    beforeEach(async () => {
        main= await Kopnik.create({
            status: Kopnik.Status.NEW,
        })
        await main.login()
        AbstractSync.clearCache()
    })

    it('reload', async () => {
        const firstName= main.firstName
        main.firstName= 'xxx'
        await main.reload()
        expect(main.firstName).toBe(firstName)
        expect(main.passport).toBe('0123')
        expect(main.location).toHaveProperty('lat')
        expect(main.location).toHaveProperty('lng')
    })
    it('somebody passport', async () => {
        const somebody= await Kopnik.create({
            status: Kopnik.Status.NEW,
        })
        const kopnik=  await Kopnik.get(somebody.id)
        expect(kopnik.passport).toBeFalsy()
    })
})
