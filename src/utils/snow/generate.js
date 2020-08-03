import _ from "lodash"

import {Kopnik} from "../../models";
import dic from '../dic/person'
import avatars from '../dic/avatars'
import getRandomizedPointInDirection from "./getRandomizedPointInDirection";
import randomize from "./randomize";

export default async function generate(foreman, distance) {
    const subordineCount = 4 + _.random(0, 5)
    let angle = 0
    let SUBORDINATES = [0,1,2,3,4,5,6,7,8,9]
    SUBORDINATES.length = subordineCount
    SUBORDINATES = await Promise.all(SUBORDINATES.map(async () => {
        angle += 2 * Math.PI / subordineCount
        const eachLocation = getRandomizedPointInDirection(foreman.location, distance, angle)
        const eachSubordinate = await Kopnik.create({
            firstName: dic.name[_.random(0, dic.name.length)],
            lastName: dic.lastName[_.random(0, dic.lastName.length)],
            patronymic: dic.middleNameMale[_.random(0, dic.middleNameMale.length)],
            location: {
                lat: eachLocation.lat,
                lng: eachLocation.lng,
            },
            foreman_id: foreman.id,
            photo: avatars[_.random(0, avatars.length)]
        })
        return eachSubordinate
    }))

    for (let eachSubordinate of SUBORDINATES) {
        const nextDistance = randomize(distance * 0.33)
        if (nextDistance > 0.3) {
            await generate(eachSubordinate, nextDistance)
        }
    }
}
