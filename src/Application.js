import {AbstractSync} from "./models";

export default class Application{
    static getInstance(){
        if (!this.instance){
            this.instance= new this()
        }
        return this.instance
    }
    constructor(){
        /**
         * Кэш моделей
         * @type {Array}
         */
        // пока не понятно зачем приложению кэш.
        // он вероятно будет сильно торможить приложение из-за реактивности App.$data в которой он находится
        // хотя он же не в App.$data а в App.$options !!
        this.models=AbstractSync.cache

        /**
         * Идентификатор раздела
         * Равен названиею соответствующего компонента
         *
         * @type {string} Map | Profile | Thanks
         */
        this.SECTION= "Profile"

        this.user= undefined
    }

    getSharedState(){
        return {
            SECTION: this.SECTION
        }
    }

    setState(state){
        if (state.SECTION){
            this.SECTION= state.SECTION
        }
    }
}