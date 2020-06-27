import {Kopnik} from "./index";
import {bottle, container} from "../bottle";
import {KopnikApiError} from "../KopnikError";
import Locale from "../locales/Locale";

describe('models Kopnik', () => {
    /** @type {Kopnik} */
    let main
    beforeEach(() => {
        main = new Kopnik()
        Kopnik.clearCache()
    })

    describe('plain', () => {
        it('Kopnik.plain', async () => {
            let main = Kopnik.getReference(1)
            main.locale = container.localeManager.currentLocale
            expect(main.plain).toMatchObject({
                locale: 'ru',
            })
        })
    })
})
