import Vue from 'vue'

import KopaInviteVue from '../../../src/components/KopaInviteVue'
import {Kopnik, Kopa} from "../../../src/models";
import flushPromises from "flush-promises";
import vuePlugins from "../../test-setup";

describe('unit components KopaInviteVue.vue',  () => {
    let vm,
        kopa

    beforeAll(async ()=>{
        await login(1)
    })

    beforeEach(async () => {
        kopa = new Kopa
        vm = new Vue({
            ...KopaInviteVue,
            ...vuePlugins,
            propsData: {
                value: kopa
            }
        })
    })

    it('render', async () => {
        const kopnik2 = Kopnik.getReference(2)

        kopa.add(kopnik2)
        vm.$mount()
        await flushPromises()
        expect(vm.$el).toMatchSnapshot()
    })
})
