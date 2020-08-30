import fetchMock from "jest-fetch-mock";
import {container} from "@/bottle/bottle";


/**
 *
 * @type {{matcher: RegExp, bodyOrHandler: any|Function, delay?:number}[]}
 */
const mocks = []
const logger = container.logger.getLogger('fetchMockIf')


/**
 * @callback MockIfCallback
 * @param {Request?} request
 * @return {any}
 */
/**
 * @param {RegExp} matcher
 * @param {MockIfCallback | Object} bodyOrHandler
 * @param {number?} delay
 * @return {void}
 */
export default function (matcher, bodyOrHandler, delay) {
  // logger.log('push mock to stack matcher:', matcher.toString())
  mocks.unshift({matcher, bodyOrHandler, delay})
  const combinedMatcher = new RegExp(mocks.map(eachMock => `(${eachMock.matcher.source})`).join('|'))

  fetchMock.mockIf(combinedMatcher, async function (request) {
    const matchedMock = mocks.find(eachMock => request.url.match(eachMock.matcher))
    if (!matchedMock){
      throw new Error(`can't find matched mock for url ${request.url}`)
    }

    logger.log(`mocking by ${matchedMock.matcher.toString()}...`)
    let response
    if (typeof matchedMock.bodyOrHandler === 'function')  {
      response = await matchedMock.bodyOrHandler(request)
    } else {
      response = matchedMock.bodyOrHandler
    }
    if (matchedMock.delay) {
      await new Promise(res => setTimeout(res, delay))
    }
    const result =JSON.stringify({
      response
    })
    return result
  })
}
