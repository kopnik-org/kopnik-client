import {AbstractSync, Kopnik} from "./models";
import {KopnikApiError} from "./KopnikError";
import config from '../config'
import log from "./plugins/loglevel";
import once from "./decorators/once";

export default class Application {
    static getInstance() {
        if (!this.instance) {
            this.instance = new this()
        }
        return this.instance
    }

    user = null

    constructor() {
        this.log= log.getLogger('application')
        /**
         * Кэш моделей
         * @type {Array}
         */
        // пока не понятно зачем приложению кэш.
        // он вероятно будет сильно торможить приложение из-за реактивности App.$data в которой он находится
        // хотя он же не в App.$data а в App.$options !!
        // уже в дата потому тчо в options не реактивен
        //this.models = AbstractSync.cache

        /**
         * Идентификатор раздела
         * Равен названиею соответствующего компонента
         *
         * @type {string} Map | Profile | Thanks
         */
        this.SECTION = "Map"

        this.user = undefined

        this.authenticate()
            .then(()=>{
                if (!this.user){
                    this.SECTION='Map'
                }
                else if (this.user.status==Kopnik.Status.NEW || this.user.status==Kopnik.Status.DECLINED){
                    this.SECTION='Profile'
                }
                else{
                    this.SECTION='Witness'
                }
            })
    }

    async authenticated(){
        if (this.user===undefined){
            await this.authenticate()
        }
        return this.user
    }

    getSharedState() {
        return {
            SECTION: this.SECTION
        }
    }

    setState(state) {
        if (state.SECTION) {
            this.SECTION = state.SECTION
        }
    }

    /**
     * Инициализирует ползователя при запуске приложения
     *
     * @returns {Promise<void>}
     */
    @once
    async authenticate() {
        try {
            let userAsPlain = (await Kopnik.api('get?ids='))[0]
            this.user=Kopnik.merge(userAsPlain)
            this.user.isLoaded= true
            this.user.photo='avatar.png'
        } catch (err) {
            if ((err instanceof KopnikApiError)) {
                this.user=null
                log.info('user not authenticated')
                // location.href= `https://oauth.vk.com/authorize?client_id=${config.messenger.clientId}&display=page&redirect_uri=${encodeURIComponent(config.messenger.redirectUrl)}&scope=status offline&response_type=code&v=5.103`
                location.replace(`https://dev.kopnik.org/connect/vkontakte`)
            }
            else{
                throw err
            }
        }
    }

    /**
     * Учстанавливает пользователем объект из VK.Auth callback
     *
     * @param vkUser
     * @returns
     */
/*    async setVkUser(vkUser) {
        global.credentials = {
            uid: vkUser.uid,
            hash: vkUser.hash
        }
        this.user = await Kopnik.getByUid(vkUser.uid)
        if (!this.user) {
            this.user = new Kopnik
            this.user.merge({
                firstName: vkUser.first_name,
                lastName: vkUser.last_name,
                photo: vkUser.photo,
                smallPhoto: vkUser.photo_rec,
            })

            this.SECTION = "Profile"
        }
        // this.user.uid= vkUser.uid
        // this.user.hash= vkUser.hash

        // localStorage.setItem("vkUser", JSON.stringify(vkUser))
    }
    */
}
