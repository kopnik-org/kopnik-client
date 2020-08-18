import Kopnik from "@/models/Kopnik";
import dic from "@/utils/dic/person";
import _ from "lodash";
import avatars from "@/utils/dic/avatars.json";
import createSubordinates from "@/utils/snow/createSubordinates";

/**
 *
 * @param {{lat:number, lng:number}} location
 * @param {number} distance
 * @param {number} iterations
 * @param {Kopnik} foreman
 * @returns {Promise<Kopnik>}
 */
export default async function ({location, distance, iterations, foreman}) {
  const center = await Kopnik.create({
    firstName: dic.name[_.random(dic.name.length - 1)],
    lastName: dic.lastName[_.random(dic.lastName.length - 1)],
    patronymic: dic.middleNameMale[_.random(dic.middleNameMale.length - 1)],
    location,
    photo: avatars[_.random(avatars.length - 1)],
    foreman_id: foreman ? foreman.id : undefined,
  })
  await createSubordinates(center, distance, iterations)
  return center
}
