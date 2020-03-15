import {container} from "../bottle/bottle";
import {KopnikApiError} from "../KopnikError";
import _ from "lodash";

export default async function api(url, options = {}) {
    const logger= container.logger.getLogger('api')

    options.method = (options.method || 'GET').toUpperCase()
    let response
    // 1. setup options
    _.merge(options, {
        credentials: 'include',
        headers: {
            Cookie: container.config.di.cookie ? container.cookieService.cookie : undefined,
            Accept: 'application/json',
            'Content-Type': options.method === 'GET' ? 'text/plain' : 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
    })

    //2. set full path to api endpoint
    let fullUrl = container.config.api.path + '/' + url

    //3. execute fetch
    try {
        response = await fetch(fullUrl, Object.assign({api: true}, options))
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
    if (container.config.di.cookie) {
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

    // 6. soft error
    if (!response.ok) {
        throw new KopnikApiError(`${response.statusText}. ${bodyText}`, response.status, fullUrl)
    }

    // 7. parse response body as JSON
    let body
    try {
        body = JSON.parse(bodyText)
    } catch (err) {
        throw new KopnikApiError(bodyText, 2000001, fullUrl)
    }

    // 8. check error from server
    if (body.error) {
        throw new KopnikApiError(body.error.error_msg, body.error.error_code, fullUrl)
    }

    // return result
    return body.response
}
