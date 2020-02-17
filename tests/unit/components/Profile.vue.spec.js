import flushPromises from "flush-promises";
import Vue from 'vue'

import vuePlugins from "../../test-setup";
import KTen from "../../../src/components/KTen";
import {bottle, container} from "../../../src/bottle/bottle";
import {Kopnik} from "../../../src/models";
import ProfileVue from "../../../src/components/ProfileVue";

describe('unit components Profile', () => {
    beforeAll(async () => {
    })

    beforeEach(() => {
    })

    it('draw new', async () => {
        await login(2)
        const kopnik= Kopnik.getReference(2)
        await container.application.authenticate()
        const vm = new Vue({
            ...ProfileVue,
            ...vuePlugins,
            propsData:{
                // value: kopnik
            }
        })
        vm.$mount()
        await flushPromises()
        expect(vm.$el).toMatchSnapshot()
    })
})

