import {bottle, container} from '../plugins/bottle'
import {utils} from 'jest-snapshot'
import {resolve} from 'path'
import JSON5 from 'json5'
import handlers from './handlers'

async function mapi(url, options = {}) {
    const user = container.cookieService.cookie || 'anonymous',
        key = `system api ${user}@${url} 1`
    // console.log(snapshotPath, key, fixtures)

    for(let [eachPattern, eachHandler] of handlers){
        if (url.match(eachPattern)){
            return eachHandler(url, user, key)
        }
    }
}

export default mapi
