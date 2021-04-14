import {container} from "@/bottle/bottle";
import {KopnikApiError} from "@/KopnikError";
import _ from "lodash";
import ApiEventEnum from "@/api/ApiEventEnum";

/**
 * import {apiEvent} from '@/api/api'
 * import ApiEventEnum from "@/api/ApiEventEnum";
 *
 * apiEvent.addEventListener(ApiEventEnum.Error, (event) => console.log(event.error.error_message));
 */
export const apiEvent = new class extends EventTarget {
}


export default async function api(url, options = {}) {
  const logger = container.logger.getLogger('api')
  let response,
    body,
    error

  try {
    // 1. setup options
    const fullOptions = _.merge({}, options, {
      method: (options.method || 'GET').toUpperCase(),
      // mode: 'no-cors', // *cors, same-origin,
      credentials: 'include',
      headers: {
        'T-Authorization': api['T-Authorization'] || '',
        Accept: 'application/json',
        'Content-Type': options.method === 'GET' ? 'text/plain' : 'application/json',
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    })

    //2. set full path to api endpoint
    let fullUrl = container.constants.api.path + '/' + url

    //3. execute fetch
    try {
      logger.info(...[fullOptions.method, fullUrl, options.body, fullOptions.headers.Cookie].filter(item => item))
      // logger.info(fullOptions.method, fullUrl, options.body, fullOptions.headers.Cookie)
      apiEvent.dispatchEvent(new CustomEvent(ApiEventEnum.BeforeFetch, {url: fullUrl, options: fullOptions}))
      response = await fetch(fullUrl, fullOptions)
    } catch (err) {
      // abort getTopInsideSquare for example
      if (err.name == 'AbortError') {
        err.url = fullUrl
        throw error= err
        // miss network
      } else {
        throw error= new KopnikApiError(err.message, err.code, fullUrl)
      }
    }
    // 4. set cookie
    if (container.constants.di.cookie) {
      let cookie = response.headers.get('set-cookie')
      if (!cookie) {
        // logger.warn('no cookie received from server')
      } else {
        cookie = cookie.match(/(\w+=(\w|\d)+)/)[0]
        container.cookieService.cookie = cookie
        // logger.debug('receive', cookie)
      }
    }
    // 5. parse response body
    const bodyText = await response.text()

    // 7. parse response body as JSON
    try {
      body = JSON.parse(bodyText)
    } catch (err) {
      throw error= new KopnikApiError(`API: ${response.statusText}: ${bodyText}`, 1000 + response.status, fullUrl)
    }

    // 8. check error from server
    if (body.error) {
      throw error= new KopnikApiError(`API: ${body.error.error_msg}`, body.error.error_code, fullUrl, body.error.error_stack,)
    } else {
      logger.debug(...[body, response.headers.get('set-cookie')].filter(item => item))
    }
    apiEvent.dispatchEvent(new CustomEvent(ApiEventEnum.Response, {...body}))
  }
  catch(dontUseIt){
    apiEvent.dispatchEvent(new CustomEvent(ApiEventEnum.Error, {error}))
    throw error
  }
  finally{
    apiEvent.dispatchEvent(new CustomEvent(ApiEventEnum.Fetch, {error, ...body}))
  }
  // return result
  return body.response
}
