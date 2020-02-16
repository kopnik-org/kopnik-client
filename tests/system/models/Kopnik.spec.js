import {KopnikApiError} from "../../../src/KopnikError";
import {AbstractSync, Kopnik} from "../../../src/models";
import {bottle, container} from "../../../src/bottle/bottle";

container.config.di.fetch = true

describe('system models Kopnik', () => {
    let kopnik

    beforeEach(() => {
        bottle.resetProviders(['cookieService'])
        AbstractSync.clearCache()
    })

})
