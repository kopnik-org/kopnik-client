import {bottle, container} from '../plugins/bottle'
import {utils} from 'jest-snapshot'
import {resolve} from 'path'
import JSON5 from 'json5'
import {KopnikApiError} from "../KopnikError";

export default async function fetchApiMock(url, options = {}) {
    const snapshotPath= resolve(__dirname, '../../tests/integration/__snapshots__/fetchApi.spec.js.snap')
    const snapshotData = utils.getSnapshotData(snapshotPath, false)
    let key = `integration/fetchApi ${url} 1`
    // console.log(snapshotPath, key, snapshotData)

    if (!container.defaultFetchApiOptions.headers.cookie){
        throw new KopnikApiError('Not Authorized', 401, container.config.api.path+url)
    }

    if (snapshotData.data[key]===undefined){
        throw new Error(`fetchApiMock could not find ${snapshotPath}[${key}]. use npm run test:integration:watch -t fetchApi`)
    }
    const temp= snapshotData.data[key].replace(/Object |Array /g, '')
    // console.log(temp)
    return JSON5.parse(temp)
}
