import AsyncLock from 'async-lock'
import {AbstractSync, Kopnik, Kopa} from "../models";
import {KopnikApiError, KopnikError} from "../KopnikError";
import once from "../decorators/once";
import SquadAnalyzer from "../SquadAnalyzer";
// import fetchIntercept from 'fetch-intercept'
import {container} from "../bottle/bottle";
import {LatLng, LatLngBounds} from 'leaflet'
import parse from "@/models/utils/parse";

export default class Main {
  constructor() {
    this.logger = container.logger.getLogger('Main')
    this.map = {
      // сохраняется между сессиями
      zoom: 2,

      earlyZoom: 2,
      /** type {LatLng} центр карты. Сохраняется между сессиями */
      center: new LatLng(55.753215, 37.622504),
      /** @type {LatLngBounds} не сохраняется между сессиями */
      bounds: undefined,
    }

    /**
     * @type {Kopnik} Выбранный копник
     */
    this.selected = null
    /**
     * Копник, по которому внизу экрана открыто окно с информацией
     * @typedef {{kopa: Kopa, value: Kopnik}} DetailsRecord
     * @type {DetailsRecord}
     */
    this.details = {
      show: false,
      value: null,
    }
    this.info = null
    /** @type {Kopnik[]} старшие 20 копников на карте  */
    this.top20 = []
    /** @type {Kopnik[]} заверители на карте  */
    this.witnesses = []
    this.squadAnalyzer = new SquadAnalyzer
    // копа, которая созывается
    this.kopa = new Kopa
    this._loadTop20AbortController = new AbortController()
    this.restoreMapState()
  }

  async toggleWitnesses() {
    if (this.witnesses.length) {
      this.witnesses.splice(0)
    } else {
      this.witnesses = (await Kopnik.api('getWitnessesInsideSquare?x1=-180&y1=-90&x2=180&y2=90'))
        .map(eachWitnessJSON => Kopnik.merge(eachWitnessJSON, true))
    }
  }

  storeMapState() {
    const map = this.map
    if (!global.localStorage) {
      this.logger.warn('no local storage')
      return
    }
    localStorage.setItem('application.sections.Main.map', JSON.stringify({
      center: {lat: map.center.lat, lng: map.center.lng},
      zoom: map.zoom,
    }))
  }

  restoreMapState() {
    const map = this.map
    if (!global.localStorage) {
      this.logger.warn('no local storage')
      return
    }
    let storedData = localStorage.getItem('application.sections.Main.map')
    if (storedData) {
      storedData = JSON.parse(storedData)
      map.zoom = storedData.zoom
      map.center = new LatLng(storedData.center.lat, storedData.center.lng)
    }
  }

  /**
   *
   * @param {LatLng} value
   */
  setMapCenter(value) {
    // this.map.center = value.wrap()
    this.storeMapState()
  }

  setMapZoom(value) {
    this.map.zoom = value
    this.storeMapState()
  }

  /**
   * Не дожидается окончания загрузки loadTop20()
   *
   * @param {LatLngBounds} value
   * @returns {void}
   */

  /*    setMapBounds(value) {
          this.map.bounds = value
          if (container.application.user) {
              this.loadTop20()
          }
      }*/

  /**
   * Каждый следующий запрос fetch отменяет предыдущий, который еще не завершился.
   * Только последний вызов fetch внутри этой функции вернет ответ.
   * @returns {Promise<void>}
   */
  async loadTop20(maxRank = 300000000) {
    // временная заглушка до поры пока Артем не сделает getTopInsideSquare публичным с ограничением
    if (!container.application.user) {
      return []
    }
    // console.log('aborting signal')
    this.abortLoadTop20()
    this._loadTop20AbortController = new AbortController()
    const bounds = this.map.bounds
    try {
      let top20AsJson = await container.api(`users/getTopInsideSquare?x1=${bounds.getWest()}&y1=${bounds.getSouth()}&x2=${bounds.getEast()}&y2=${bounds.getNorth()}&count=10&maxRank=${maxRank}`, {
        signal: this._loadTop20AbortController.signal
      })

      this.top20 = top20AsJson.map(eachTopPlain => Kopnik.merge(parse(Kopnik, eachTopPlain)))
    } catch (err) {
      if (err.name === 'AbortError') {
        return
      } else {
        throw err
      }
    }
  }

  abortLoadTop20() {
    this._loadTop20AbortController.abort()
  }
}
