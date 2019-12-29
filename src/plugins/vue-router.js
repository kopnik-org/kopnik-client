import Vue from "vue"
import VueRouter from "vue-router";
import Profile from "../components/ProfileVue";
import Witness from "../components/WitnessVue";
import Map from "../components/MainVue";
import Thanks from "../components/ThanksVue";
import {container} from "./bottle";
import {Kopnik} from '../models'
import Application from "../Application";

Vue.use(VueRouter)
const application = container.application

const routes = [
    {
        path: '/' + Application.section.Profile,
        beforeEnter: async (to, from, next) => {
            await application.setSection(Application.section.Profile)
            next()
        }
    },
    {
        path: '/' + Application.section.Witness,
        beforeEnter: async (to, from, next) => {
            await application.setSection(Application.section.Witness)
            next()
        }
    },
    {
        path: '/' + Application.section.Thanks,
        beforeEnter: async (to, from, next) => {
            await application.setSection(Application.section.Thanks)
            next()
        }
    },
    {
        path: '/',
        beforeEnter: async (to, from, next) => {
            await application.setSection(Application.section.Main)
            next()
        },
    },
]
const router = new VueRouter({
    mode: 'history',
    routes
})
export default router
