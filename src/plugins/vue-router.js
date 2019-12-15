import Vue from "vue"
import VueRouter from "vue-router";
import Profile from "../components/Profile";
import Witness from "../components/Witness";

Vue.use(VueRouter)

let application= global.application

const routes = [
    // { path: '/', component: Map },
    {
        path: '/Profile',
        component: Profile,
        beforeEnter: async (to, from, next) => {
            console.log('before /Profile')
            if (global.app.user===undefined){
                await app.initUser()
            }
            if (global.app.user){
                return next()
            }
            else{
                next({path:'/'})
            }
        }
    },
    {path: '/Witness', component: Witness},
]

export default new VueRouter({
    mode: 'history',
    routes
})
