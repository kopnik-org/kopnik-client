import _ from "lodash"

import {Kopnik} from "../../models";
import dic from '../dic/person'
import getRandomPointInCircle from "./getRandomPointInCircle";


export default async function generate(foreman, distance) {
    const subordineCount = 4+_.random(0, 5)
    let angle= Math.random()
    for (let i = 0; i < subordineCount; i++) {
        angle+= 2*Math.PI/subordineCount
        const eachLocation = getRandomPointInCircle(foreman.location, distance, angle)
        const eachSubordinate = await Kopnik.create({
            firstName: dic.name[_.random(0, dic.name.length)],
            lastName: dic.lastName[_.random(0, dic.lastName.length)],
            patronymic: dic.middleNameMale[_.random(0, dic.middleNameMale.length)],
            location: {
                lat: eachLocation.lat,
                lng: eachLocation.lng,
            },
            foreman_id: foreman.id,
        })

        const nextDistance= distance*0.1
        if (nextDistance>1){
            await generate(eachSubordinate, nextDistance)
        }
    }
}
