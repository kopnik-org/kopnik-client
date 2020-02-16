import {bottle, container} from '../bottle/bottle'
import {utils} from 'jest-snapshot'
import {resolve} from 'path'
import JSON5 from 'json5'
import handlers from './handlers'
import getData from "./data";

async function mapi(url, options = {}) {
    options.method = (options.method || 'get').toLowerCase()
    const user = container.cookieService.cookie || 'anonymous',
        key = `system api ${options.method} ${user} ${url} 1`
    // console.log('cookie', container.cookieService.cookie)


    for (let [eachPattern, eachHandler] of handlers) {
        if (url.match(eachPattern)) {
            return eachHandler(url, options, user, key, options.method)
        }
    }
}

export default mapi
export {getData}
