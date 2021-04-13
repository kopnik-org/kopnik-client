import Locale from "@/locales/Locale";
import {container} from "@/bottle/bottle";
import * as models from "@/models";
import {Kopnik} from "@/models";

/**
 * Парсит плоские данные в СУЩНОСТЬ
 * по умолчанию СУЩНОСТЬ isLoaded=true
 * Сущности в связях вмерживает
 *
 * @param  constructor
 * @param {object} plain
 */
export default function parse(constructor, plain) {
  const result = new constructor()
  if (plain.isLoaded === undefined) {
    result.isLoaded = true
  } else {
    result.isLoaded = plain.isLoaded
  }
  for (let eachScalarName of ["id", ...constructor.scalars]) {
    if (plain.hasOwnProperty(eachScalarName)) {
      result[eachScalarName] = plain[eachScalarName]
    }
  }
  for (let eachRelationName of constructor.objects) {
    if (plain.hasOwnProperty(eachRelationName)) {
      if (plain[eachRelationName] === null) {
        result[eachRelationName] = null
      } else if (typeof plain[eachRelationName] === 'object') {
        result[eachRelationName] = parse(models.Kopnik, plain[eachRelationName])
      } else if (typeof plain[eachRelationName] === 'number') {
        result[eachRelationName] = parse(models.Kopnik, {id: plain[eachRelationName], isLoaded: false})
      } else if (plain[eachRelationName] === undefined) {
      } else {
        throw new Error('Wrong format for relation ' + eachRelationName)
      }
    }
  }
  for (let eachRelationName of constructor.collections) {
    if (plain.hasOwnProperty(eachRelationName)) {
      if (Array.isArray(plain[eachRelationName])) {
        result[eachRelationName] = plain[eachRelationName].map(eachRelationItem => {
          if (typeof eachRelationItem === 'object') {
            return parse(models.Kopnik, eachRelationItem)
          } else if (typeof eachRelationItem === 'number') {
            return parse(models.Kopnik, {id: eachRelationItem, isLoaded: false})
          }
        })
      } else if (plain[eachRelationName] === undefined) {
      } else {
        throw new Error('Wrong format for relations ' + eachRelationName)
      }
    }
  }

  if (plain.locale !== undefined) {
    result.locale = (plain.locale instanceof Locale) ? plain.locale : container.localeManager.getLocaleByShortName(plain.locale)
  }

  return result
}
