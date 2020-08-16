import {Kopnik} from "./models";
import _ from 'lodash'

export default class SquadAnalyzer {
  /**
   * Исследованные участники десяток
   * @type {Kopnik[]}
   */
  analyzed = []

  /**
   * Исследует дружину вокруг заданного копника
   *
   * @param {Kopnik} kopnik
   * @returns {Promise<void>}
   */
  async analyzeAround(kopnik) {
    await kopnik.loaded()
    // добавляем самого
    const localAnalyzed = [kopnik]
    // добавляем его старшину
    if (kopnik.foreman) {
      await kopnik.foreman.loaded()
      localAnalyzed.push(kopnik.foreman)
    }
    // добавляем его подчиненных
    await kopnik.reloadSubordinates()
    localAnalyzed.push(...kopnik.subordinates)

    // проверяем, что это та же человеческая машина
    const isSame = _.intersection(localAnalyzed, this.analyzed)
    if (!isSame) {
      this.reset()
    }

    // и помещаем всех, кто новенький, в общий анализируемый котел
    for (let eachLocalAnalyzed of localAnalyzed) {
      if (!this.isAnalyzed(eachLocalAnalyzed)) {
        this.analyzed.push(eachLocalAnalyzed)
      }
    }
    // обновляем потому что возможно у него уже изменился старшина
    await kopnik.reload()
  }

  isAnalyzed(kopnik) {
    return this.analyzed.includes(kopnik)
  }

  isAnalyzing() {
    return this.analyzed.length
  }

  reset() {
    this.analyzed.splice(0)
  }
}
