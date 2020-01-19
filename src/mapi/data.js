import {resolve} from "path";
import {utils} from "jest-snapshot";
import JSON5 from "json5";
import {KopnikApiError} from "../KopnikError";


function getData() {
    const result = {}

    for (let method of ['get', 'post']) {
        let snapshotPath = resolve(__dirname, `../../tests/system/api/__snapshots__/${method}.spec.js.snap`),
            snapshots = utils.getSnapshotData(snapshotPath, false).data

        for (let [key, eachSnapshot] of Object.entries(snapshots)) {
            const eachSnapshotJson = eachSnapshot.replace(/Object |Array /g, '')
            // console.log(temp)
            let eachSnapshotAsObject = JSON5.parse(eachSnapshotJson)
            if (eachSnapshotAsObject.error) {
                eachSnapshotAsObject = new KopnikApiError(eachSnapshotAsObject.error.message, eachSnapshotAsObject.error.code, eachSnapshotAsObject.error.url, eachSnapshotAsObject.error.base)
            }
            result[key] = eachSnapshotAsObject
        }
    }
    return result
}

export default getData
