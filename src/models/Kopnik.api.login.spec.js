import api from "../api";
import {bottle, container} from "../bottle/bottle";
import {KopnikApiError} from "../KopnikError";
import {AbstractSync, Kopnik} from "./index";
import {collection, object, scalar} from "../decorators/sync";
import reset from "../../tests/utils/reset";

// real fetch
container.constants.di.fetch = true

describe('models User', () => {
    /** @type {Kopnik} */
    let main

    beforeEach(async () => {
        main = await Kopnik.create()
    })

    it('login()', async () => {
        await main.login()

        const user= new Kopnik()
        await user.reload()
        expect(user.id).toBe(main.id)
    })
})
