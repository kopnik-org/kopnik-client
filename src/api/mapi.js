import {bottle, container} from '../plugins/bottle'
import {utils} from 'jest-snapshot'
import {resolve} from 'path'
import JSON5 from 'json5'
import {KopnikApiError} from "../KopnikError";

export default async function mapi(url, options = {}) {
    const snapshotPath = resolve(__dirname, '../../tests/system/__snapshots__/api.spec.js.snap'),
        snapshotData = utils.getSnapshotData(snapshotPath, false),
        user= container.cookieService.cookie||'anonymous',
        key = `system api ${user}@${url} 1`
    // console.log(snapshotPath, key, snapshotData)

    if (!container.cookieService.cookie && !url.match(/test.login.\d+/)) {
        throw new KopnikApiError('Not Authorized', 401, container.config.api.path + url)
    }

    if (snapshotData.data[key] === undefined) {
        throw new Error(`mapi could not find ${snapshotPath}[${key}]. use npm run test:system:watch -t fetchApi`)
    }
    const temp = snapshotData.data[key].replace(/Object |Array /g, '')
    // console.log(temp)
    if (url.match(/test.login.\d+/)) {
        const id = url.match(/test.login.(\d+)/)[1]
        container.cookieService.cookie = `user${id}`
    }
    return JSON5.parse(temp)
}
