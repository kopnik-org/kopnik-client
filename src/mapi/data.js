import {resolve} from "path";
import {utils} from "jest-snapshot";
import JSON5 from "json5";


function getData() {
    const result = [],
        snapshotPath = resolve(__dirname, '../../tests/system/__snapshots__/api.spec.js.snap'),
        snapshots = utils.getSnapshotData(snapshotPath, false).data

    for (let [key, eachSnapshot] of Object.entries(snapshots)) {
        const eachSnapshotJson = eachSnapshot.replace(/Object |Array /g, '')
        // console.log(temp)
        result[key] = JSON5.parse(eachSnapshotJson)
    }
    return result
}

export default getData
