import getData from './data'
import {KopnikApiError} from "../KopnikError"
import {container} from "../bottle/bottle"

const mapiData = getData()
const handlers = new Map()

handlers.set(/test\/login\/\d+/, (url, options, user, key) => {
    const userId = url.match(/test.login.(\d+)/)[1]

    // console.log('cookie', `user${userId}`)
    container.cookieService.cookie = `user${userId}`
    return data(key)
})

handlers.set(/.*/, (url, options, user, key) => {
    if (user === 'anonymous') {
        throw new KopnikApiError('Not Authorized', 401, container.config.api.path + url)
    }
    return data(key)
})

function data(key) {
    if (mapiData[key] === undefined) {
        throw new Error(`mapi could not find [${key}]. use npm run test:system:watch -t fetchApi`)
    }
    let result= mapiData[key]
    if (result instanceof Error){
        throw result
    }
    return result
}

export default handlers
