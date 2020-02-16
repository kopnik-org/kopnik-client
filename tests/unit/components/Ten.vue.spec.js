import flushPromises from "flush-promises";
import Vue from 'vue'

import vuePlugins from "../../test-setup";
import KTen from "../../../src/components/KTen";
import {bottle, container} from "../../../src/bottle/bottle";
import {Kopnik} from "../../../src/models";

describe('unit components Ten', () => {
    beforeAll(async () => {
        await login(6)
    })

    beforeEach(() => {
    })

    it.skip('draw', async () => {
        const kopnik= Kopnik.getReference(6)
        await container.application.authenticate()
        kopnik.ten= [7,].map(eachDruzheId=>Kopnik.getReference(eachDruzheId))
        kopnik.witnessRequests= [1,].map(eachDruzheId=>Kopnik.getReference(eachDruzheId))
        const vm = new Vue({
            ...KTen,
            ...vuePlugins,
            propsData:{
                value: kopnik
            }
        })
        vm.$mount()
        await flushPromises()
        expect(vm.$el).toMatchSnapshot()
    })
})

