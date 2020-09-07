import {KopnikApiError} from "../KopnikError";
import {bottle, container} from "../bottle/bottle";

import api from "./index";

describe('api bodyError', () => {
  it('/api/error', async () => {
    try {
      await api('bodyError', {
        method: 'post',
        body: {
          number: [1234], // []
          string: 'qwerty', //[]
          array: [1, 2, 3], //''
          object: {a: 1, b: 2},// ''
        }
      })
      throw new Error('should not be hire')
    } catch (err) {
      expect(err).toBeKopnikError(1500)
      // expect(err).toBeKopnikError(500)
    }
  })

  it('/api/unknown method', async () => {
    try {
      await api('unknownMethod')
      throw new Error('should not be hire')
    } catch (err) {
      console.log(err)
      expect(err).toBeKopnikError(1404)
      expect(err.message).toContain('unknown')
    }
  })
})

