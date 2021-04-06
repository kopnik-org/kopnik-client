import {container} from "../bottle/bottle";
import {KopnikApiError} from "../KopnikError";
import _ from "lodash";
import {Base64} from 'js-base64';

export default async function api(url, options = {}) {
  const logger = container.logger.getLogger('api')
  let response
  // let vkSession = container.VK.Auth.session;

  // 0. update token
/*  if (vkSession && vkSession.expire * 1000 - 1 * 60000 < new Date().getTime()) {
    await new Promise((res,) => {
      container.VK.Auth.login(session => {
        container.VK.Auth.session = vkSession = session.session
        res()
      })
    })
  }*/

  // 1. setup options
  const fullOptions = _.merge({}, options, {
    method: (options.method || 'GET').toUpperCase(),
    // mode: 'no-cors', // *cors, same-origin,
    credentials: 'include',
    headers: {
      // AuthorizationPlain: JSON.stringify(container.VK.Auth.session),
      'T-Authorization': api['T-Authorization'] || '',
      Accept: 'application/json',
      // 'Content-Type': options.method === 'GET' ? 'text/plain' : 'application/x-www-form-urlencoded;charset=UTF-8',
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
    response = await fetch(fullUrl, Object.assign({api: true}, fullOptions))
  } catch (err) {
    // abort getTopInsideSquare for example
    if (err.name == 'AbortError') {
      err.url = fullUrl
      throw err
      // miss network
    } else {
      throw new KopnikApiError(err.message, err.code, fullUrl)
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

  // 6. network error
  // if (!response.ok) {
  //   throw new KopnikApiError(`${response.statusText}. ${bodyText}`, response.status, fullUrl)
  // }

  // 7. parse response body as JSON
  let body
  try {
    body = JSON.parse(bodyText)
  } catch (err) {
    throw new KopnikApiError(`API: ${response.statusText}: ${bodyText}`, 1000 + response.status, fullUrl)
  }

  // 8. check error from server
  if (body.error) {
    throw new KopnikApiError(`API: ${body.error.error_msg}`, body.error.error_code, fullUrl, body.error.error_stack,)
  } else {
    logger.debug(...[body, response.headers.get('set-cookie')].filter(item => item))
  }

  // return result
  return body.response
}
