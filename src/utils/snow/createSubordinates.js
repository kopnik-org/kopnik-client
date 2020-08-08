import _ from "lodash"

import {Kopnik} from "../../models";
import dic from '../dic/person'
import avatars from '../dic/avatars'
import avatars2 from '../dic/avatars2'
import getPointInDirection from "./getRandomizedPointInDirection";
import randomize from "./randomize";

const MIN_DISTANCE = 0.33
const K_DISTANCE = 0.33

export default async function createSubordinates(foreman, distance) {
    const subordinatesCount = 4 + _.random(0, 5)
    let angle = 0
    for (let i = 0; i < subordinatesCount; i++) {
        angle += 2 * Math.PI / subordinatesCount
        const eachSubordinateLocation = getPointInDirection(foreman.location, randomize(distance), randomize(angle))
        const eachSubordinateNextDistance = randomize(distance * K_DISTANCE)
        const isEachSubordinateForeman = eachSubordinateNextDistance >= MIN_DISTANCE
        const eachSubordinate = await Kopnik.create({
            firstName: dic.name[_.random(0, dic.name.length)],
            lastName: dic.lastName[_.random(0, dic.lastName.length)],
            patronymic: dic.middleNameMale[_.random(0, dic.middleNameMale.length)],
            location: {
                lat: eachSubordinateLocation.lat,
                lng: eachSubordinateLocation.lng,
            },
            foreman_id: foreman.id,
            photo: isEachSubordinateForeman ? avatars[_.random(0, avatars.length)] : avatars2[_.random(0, avatars2.length)]
        })
        if (isEachSubordinateForeman) {
            await createSubordinates(eachSubordinate, eachSubordinateNextDistance)
        }
    }
}
