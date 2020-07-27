import {Kopnik} from "./models";

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
        if (!this.isAnalyzed(kopnik)) {
            this.reset()
        }
        await kopnik.loaded()
        // добавляем самого
        const localAnalyzed = [kopnik]
        // добавляем его старшину
        if (kopnik.foreman) {
            localAnalyzed.push(await kopnik.foreman.loaded())
        }
        // добавляем его подчиненных
        localAnalyzed.push(...await kopnik.loadedSubordinates())

        // и помещаем всех, кто новенький, в общий анализируемый котел
        for (let eachLocalAnalyzed of localAnalyzed) {
            if (!this.isAnalyzed(eachLocalAnalyzed)) {
                this.analyzed.push(eachLocalAnalyzed)
            }
        }
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
