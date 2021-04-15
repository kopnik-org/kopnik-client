import {Kopnik} from "./index";
import Locale from "../locales/Locale";
import LocaleManager from "../locales/LocaleManager";
import parse from "@/models/utils/parse";

describe('models Kopnik merge', () => {
    it('relation', () => {
      const user= Kopnik.getReference(1)
      const foreman= Kopnik.getReference(2)

      user.foreman= foreman

      // set
      const foreman2= new Kopnik()
      foreman2.id=2
      foreman2.firstName= 'Foreman'
      user.merge({
        foreman: foreman2
      })

      //expect
      expect(user.foreman).toBe(foreman)
      expect(user.foreman).toHaveProperty('firstName', 'Foreman')
    })
    it('relation collection', () => {
      const user= Kopnik.getReference(1)
      const subordinate= Kopnik.getReference(2)

      user.subordinates= [subordinate]

      // set
      const subordinate2= new Kopnik()
      subordinate2.id=2
      subordinate2.firstName= 'Subordinate'
      user.merge({
        subordinates: [subordinate2]
      })

      //expect
      expect(user.subordinates[0]).toBe(subordinate)
      expect(user.subordinates[0]).toHaveProperty('firstName', 'Subordinate')
    })

    it('cycle relation', () => {
      const foreman= Kopnik.getReference(1)
      const subordinate= Kopnik.getReference(2)

      foreman.subordinates=[subordinate]
      subordinate.foreman= foreman

      Kopnik.merge(subordinate)
    })
})
