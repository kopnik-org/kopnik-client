import Vue from "vue"

import VueRouter from "vue-router";
import {container} from "../bottle/bottle";
import Application from "../application/Application";

Vue.use(VueRouter)
// const application = container.application  не работает в тестах, потому что при каждом тесте application создается по новой

/**
 * Маршрут меняется только как реакция на изменение application.Section
 * next(false) срабатывает уже после цепочки, чтобы не было маргания роутов, и ни на что уже не влияет
 * setSection(newSection) -> watch(application.Section) -> next()
 *
 */
const routes = [
    {
        path: '/' + Application.Section.Profile.toLowerCase(),
        name: Application.Section.Profile,
    },
    {
        path: '/' + Application.Section.Witness.toLowerCase(),
        name: Application.Section.Witness,
    },
    {
        path: '/' + Application.Section.Ten.toLowerCase(),
        name: Application.Section.Ten,
    },
    {
        path: '/' + Application.Section.Thanks.toLowerCase(),
        name: Application.Section.Thanks,
    },
    {
        path: '/' + Application.Section.Login.toLowerCase(),
        name: Application.Section.Login,
    },
    {
        path: '/',
        name: Application.Section.Main,
    },
]

/**
 * Фабрика для тестов важна,
 * чтобы в каждом тесте был свой чистый роутер,
 * не зависящий от предедущих тестов
 *
 * @returns {VueRouter}
 */
function routerFactory() {
    const result = new VueRouter({
        mode: 'history',
        routes,
    })
    result.beforeEach(async (to, from, next) => {
        const application = container.application
        // на уровне логики секция уже сменилась, и KApp перехватив это в watcher'е редиректит на этот роут
        if (application.section === to.name) {
            next()
        }
        // сюда проходим только при открытии приложения в браузере с непустой роутом в адресной строке
        else {
            await application.lockSection(async () => {
                await application.setSection(to.name)
                // переход по плану
                if (application.section === to.name) {
                    next()
                }
                // переход на другой роут
                else {
                    next({name: application.section})
                }
            })
        }
    })
    return result
}

export default routerFactory
