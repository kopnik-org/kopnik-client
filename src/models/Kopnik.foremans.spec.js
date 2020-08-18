import {Kopnik} from "./index";
import {bottle, container} from "../bottle/bottle";
import {KopnikApiError} from "../KopnikError";
import Locale from "../locales/Locale";

describe('models Kopnik', () => {
    describe('foremans', () => {
        it('empty', async () => {
          let main= new Kopnik()

          expect(main.foremans).toHaveLength(0)
        })
        it('2 foremans', async () => {
          let main= new Kopnik()
          main.foreman= new Kopnik()
          main.foreman.foreman= new Kopnik()

          expect(main.foremans).toHaveLength(2)
          expect(main.foremans[0]).toBe(main.foreman)
        })
    })
})
