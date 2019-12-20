import {KopnikApiError} from "../../../src/KopnikError";

require('isomorphic-fetch');

import {Kopnik} from "../../../src/models";
import {bottle} from "../../../src/plugins/bottle";

bottle.setup({fetch:false})
describe('integration/models/kopnik', () => {
    describe('putWitnessRequest', () => {
        it.skip('Kopnik.putWitnessRequest success', async () => {
            let kopnik1 = Kopnik.getReference(1)
            await kopnik1.loaded()

            let result = await kopnik1.putWitnessRequest(kopnik1.plain)
            console.debug(result)
            // expect(kopnik1.name).toMatch(/\w+/)
        })
    })
})
