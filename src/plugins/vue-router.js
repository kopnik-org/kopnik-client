import Vue from "vue"

import VueRouter from "vue-router";
import Profile from "../components/ProfileVue";
import Witness from "../components/WitnessVue";
import Map from "../components/MainVue";
import Thanks from "../components/ThanksVue";
import {container} from "./bottle";
import {Kopnik} from '../models'
import Application from "../Application";
import flushPromises from "flush-promises";

Vue.use(VueRouter)
const application = container.application

/**
 * Маршрут меняется только как реакция на изменение application.section
 * next(false) срабатывает уже после цепочки, чтобы не было маргания роутов, и ни на что уже не влияет
 * setSection(newSection) -> watch(application.section) -> next()
 *
 */
const routes = [
    {
        path: '/' + Application.section.Profile.toLowerCase(),
        name: Application.section.Profile,
        beforeEnter: async (to, from, next) => {
            await application.lockSection(async () => {
                await application.setSection(Application.section.Profile)
                if (application.SECTION === Application.section.Profile) {
                    next()
                } else {
                    next({name: application.SECTION})
                }
            })
        }
    },
    {
        path: '/' + Application.section.Witness.toLowerCase(),
        name: Application.section.Witness,
        beforeEnter: async (to, from, next) => {
            await application.lockSection(async () => {
                await application.setSection(Application.section.Witness)
                if (application.SECTION === Application.section.Witness) {
                    next()
                } else {
                    next({name: application.SECTION})
                }
            })
        }
    },
    {
        path: '/' + Application.section.Thanks.toLowerCase(),
        name: Application.section.Thanks,
        beforeEnter: async (to, from, next) => {
            await application.lockSection(async () => {
                await application.setSection(Application.section.Thanks)
                if (application.SECTION === Application.section.Thanks) {
                    next()
                } else {
                    next({name: application.SECTION})
                }
            })
        }
    },
    {
        path: '/',
        name: Application.section.Main,
        beforeEnter: async (to, from, next) => {
            await application.lockSection(async () => {
                await application.setSection(Application.section.Main)
                if (application.SECTION === Application.section.Main) {
                    next()
                } else {
                    next({name: application.SECTION})
                }
            })
        }
    },
]
const router = new VueRouter({
    mode: 'history',
    routes
})
export default router
