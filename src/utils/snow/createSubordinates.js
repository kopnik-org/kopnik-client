import _ from "lodash"

import {Kopnik} from "../../models";
import dic from '../dic/person'
import avatars from '../dic/avatars'
import avatars2 from '../dic/avatars2'
import getPointInDirection from "./getRandomizedPointInDirection";
import randomize from "./randomize";

const K_DISTANCE = 0.33

export default async function createSubordinates(foreman, distance, iterations=1) {
  // iterations=Math.min(1, iterations)
  const subordinatesCount = 4 + _.random(0, 5)
  // const subordinatesCount = 2
  let angle = 0
  for (let i = 0; i < subordinatesCount; i++) {
    angle += 2 * Math.PI / subordinatesCount
    const eachSubordinateLocation = getPointInDirection(foreman.location, randomize(distance), randomize(angle))
    if (eachSubordinateLocation.lat > 70) {
      const eachSubordinateLocation = getPointInDirection(foreman.location, randomize(distance/2), randomize(angle))
    }
    const eachSubordinateNextDistance = randomize(distance * K_DISTANCE)
    const isEachSubordinateForeman = iterations>1
    const eachSubordinate = await Kopnik.create({
      firstName: dic.name[_.random(dic.name.length - 1)],
      lastName: dic.lastName[_.random(dic.lastName.length - 1)],
      patronymic: dic.middleNameMale[_.random(dic.middleNameMale.length - 1)],
      location: {
        lat: eachSubordinateLocation.lat,
        lng: eachSubordinateLocation.lng,
      },
      foreman_id: foreman.id,
      photo: isEachSubordinateForeman ? avatars[_.random(avatars.length-1)] : avatars2[_.random(avatars2.length-1)]
    })
    if (isEachSubordinateForeman) {
      await createSubordinates(eachSubordinate, eachSubordinateNextDistance, iterations-1)
    }
  }
}
