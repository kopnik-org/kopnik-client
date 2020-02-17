import AsyncLock from 'async-lock'
import {AbstractSync, Kopnik, Kopa} from "../models";
import {KopnikApiError, KopnikError} from "../KopnikError";
import once from "../decorators/once";
import SquadAnalyzer from "../SquadAnalyzer";
import fetchIntercept from 'fetch-intercept'
import {container} from "../bottle/bottle";
import {LatLng, LatLngBounds} from 'leaflet'

export default class Main {
    constructor() {
        this.logger = container.logger.getLogger('Main')
        this.map = {
            // сохраняется между сессиями
            zoom: 2,
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
        this.squadAnalyzer = new SquadAnalyzer
        // копа, которая созывается
        this.kopa = new Kopa
        this._loadTop20AbortController = new AbortController()
        this.restoreMapState()
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
     * Исследует дружину
     * @param {Kopnik} kopnik
     * @returns {Promise<void>}
     */
    async analyzeSquad(kopnik) {
        await this.squadAnalyzer.analyze(kopnik)
    }

    /**
     *
     * @param {LatLng} value
     */
    setMapCenter(value) {
        this.map.center= value.wrap()
        this.storeMapState()
    }

    setMapZoom(value) {
        this.map.zoom = value
        this.storeMapState()
    }

    async setMapBounds(value) {
        this.map.bounds = value
        await this.loadTop20()
    }

    /**
     * Каждый следующий запрос fetch отменяет предыдущий, который еще не завершился.
     * Только последний вызов fetch внутри этой функции вернет ответ.
     * @returns {Promise<void>}
     */
    async loadTop20() {
        // временно не выводим копников до регистрации
        if(!container.application.user){
            return
        }

        this._loadTop20AbortController.abort()
        this._loadTop20AbortController = new AbortController()
        const bounds = this.map.bounds
        try {
            let top20AsJson = await container.api(`users/getTopInsideSquare?x1=${bounds.getWest()}&y1=${bounds.getSouth()}&x2=${bounds.getEast()}&y2=${bounds.getNorth()}&count=20`, {
                signal: this._loadTop20AbortController.signal
            })
            this.top20 = top20AsJson.map(eachTopAsJson => Kopnik.merge(eachTopAsJson, true))

            // this.logger.info('manual set foremans')
            // Kopnik.getReference(1).rank = 1
            // Kopnik.getReference(1).foreman = Kopnik.getReference(3)
            // Kopnik.getReference(2).rank = 4
            // Kopnik.getReference(3).foreman = Kopnik.getReference(2)
            // Kopnik.getReference(3).rank = 3
            // Kopnik.getReference(4).foreman = Kopnik.getReference(3)
            // Kopnik.getReference(4).rank = 1
            //
            // Kopnik.getReference(1).ten = []
            // Kopnik.getReference(2).ten = [Kopnik.getReference(3)]
            // Kopnik.getReference(3).ten = [Kopnik.getReference(1), Kopnik.getReference(4)]
            // Kopnik.getReference(4).ten = []
        } catch (err) {
            if (err.name === 'AbortError') {
                return; // Continuation logic has already been skipped, so return normally
            } else {
                throw err
            }
        }
    }

    abortLoadTop20() {
        this._loadTop20AbortController.abort()
    }
}
