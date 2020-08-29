import {container} from '../bottle/bottle'
import api from "@/api";

/**
 * @typedef {string|RegExp|Function} Matcher
 */

/**
 * @callback Handler
 * @param {string} url
 * @param {object} options
 */
/**
 * @callback Mockk
 * @param {Matcher} matcher
 * @param {Handler} handler
 */
/**
 * @type {{matcher:Matcher, handler: Handler}[]}
 */
const mocks = []

async function mapi(url, options = {}) {
  // нахожу мок обработчик
  const mock = mocks.find(({matcher, handler}) => {
    if (typeof matcher === 'function') {
      return matcher(url, options)
    } else if (typeof matcher === 'string') {
      return url.includes(matcher)
    } else if (matcher && matcher instanceof RegExp) {
      return url.match(matcher)
    }
  })

  let result
  if (mock) {
    result = await mock.handler(url, options)
  } else {
    result = await api(url, options)
  }
  return result
}

/**
 *
 * @param {Matcher} matcher
 * @param {Handler} handler
 */
mapi.mock = function (matcher, handler) {
  mocks.unshift({matcher, handler})
}

export default mapi
