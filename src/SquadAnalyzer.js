import {Kopnik} from "./models";

export default class SquadAnalyzer {
    /**
     * Исследованная часть дружины
     * @type {Kopnik[]}
     */
    members = []
    /**
     *  С каго началось иссследование общины
     *  Все его старшины попадают в ммассив @see foremans
     * @type {Kopnik}
     */
    starter = undefined
    /**
     *  Старшины @see starter
     * @type {Kopnik[]}
     */
    foremans = []

    /**
     * Исследует дружину
     * Все старшины стартера помещаются в foremans
     *
     * @param {Kopnik} kopnik
     * @returns {Promise<void>}
     */
    async analyze(kopnik) {
        if (!this.isMember(kopnik)){
            this.reset()
            this.starter = kopnik
        }
        const analyzed = [kopnik]
        if (kopnik.foreman) {
            await kopnik.foreman.loaded()
            analyzed.push(await kopnik.foreman)
            if (!this.foremans.includes(kopnik.foreman) && (kopnik === this.starter || this.foremans.includes(kopnik))) {
                this.foremans.push(kopnik.foreman)
            }
        }
        let ten= await kopnik.loadedTen
        analyzed.push(...ten)
        for (let eachMember of analyzed) {
            if (!this.members.includes(eachMember)) {
                this.members.push(eachMember)
            }
        }
    }

    isMember(kopnik) {
        return (this.members.includes(kopnik))
    }

    isAnalyzing(){
        return this.members.length
    }

    reset() {
        this.members.splice(0)
        this.foremans.splice(0)
        this.starter = null
    }
}
