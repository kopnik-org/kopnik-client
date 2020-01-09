import getData from './data'
import {KopnikApiError} from "../KopnikError"
import {container} from "../plugins/bottle"

const mapiData = getData()
const handlers = new Map()

handlers.set(/test\/login\/\d+/, (url, user, key, next) => {
    const userId = url.match(/test.login.(\d+)/)[1]

    // console.log('cookie', `user${userId}`)
    container.cookieService.cookie = `user${userId}`
    return data(key)
})

handlers.set(/.*/, (url, user, key, next) => {
    if (user === 'anonymous') {
        throw new KopnikApiError('Not Authorized', 401, container.config.api.path + url)
    }
    return data(key)
})

function data(key) {
    if (mapiData[key] === undefined) {
        throw new Error(`mapi could not find [${key}]. use npm run test:system:watch -t fetchApi`)
    }
    return mapiData[key]
}

export default handlers
