import {Kopnik} from "./index";
import Locale from "../locales/Locale";
import LocaleManager from "../locales/LocaleManager";
import parse from "@/models/utils/parse";

describe('models Kopnik merge', () => {
    it('cycle relation', () => {
      const foreman= Kopnik.getReference(1)
      const subordinate= Kopnik.getReference(2)

      foreman.subordinates=[subordinate]
      subordinate.foreman= foreman

      Kopnik.merge(subordinate)
    })
})
