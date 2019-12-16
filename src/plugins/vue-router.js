import Vue from "vue"
import VueRouter from "vue-router";
import Profile from "../components/Profile";
import Witness from "../components/Witness";
import Map from "../components/Map";
import Thanks from "../components/Thanks";

Vue.use(VueRouter)

let application = global.application

const routes = [
    // { path: '/', component: Map },
    {
        path: '/Profile',
        component: Profile,
        beforeEnter: async (to, from, next) => {
            console.log('before /Profile')
            if (global.app.user === undefined) {
                await app.initUser()
            }
            if (global.app.user) {
                return next()
            } else {
                next({path: '/'})
            }
        }
    },
    {
        path: '/witness',
        component: Witness,
        beforeEnter: async (to, from, next) => {
            console.log('before /witness')
            if (global.app.user === undefined) {
                await app.initUser()
            }
            if (global.app.user) {
                return next()
            } else {
                next({path: '/'})
            }
        }
    },
    {
        path: '/thanks',
        component: Thanks,
    },
    {
        path: '/',
        component: Map,
    },
]

export default new VueRouter({
    mode: 'history',
    routes
})
