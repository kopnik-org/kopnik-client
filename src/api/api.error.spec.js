import {KopnikApiError} from "../KopnikError";
import {bottle, container} from "../bottle/bottle";

import api from "./index";
import {apiEvent} from "@/api/api";
import ApiEventEnum from "@/api/ApiEventEnum";

describe('api bodyError', () => {
  it('/api/error', async () => {
    expect.assertions(1)
    try {
      await api('test/error', {
        method: 'get',
      })
    } catch (err) {
      expect(err).toBeKopnikError(1500)
    }
  })

  it('Error event dispatching', async () => {
    expect.assertions(1)

    const handler= (event)=>{
      expect(event.detail.error.code).toBe(1500)
    }

    apiEvent.addEventListener(ApiEventEnum.Error, handler)
    // apiEvent.removeEventListener(ApiEventEnum.Error, handler)

    try {
      await api('test/error', {
        method: 'get',
      })
    } catch (err) {
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

