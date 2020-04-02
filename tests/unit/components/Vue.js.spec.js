import {mount} from '@vue/test-utils'
import Demo from '../../../src/components/test/Demo'
import flushPromises from "flush-promises";
import Vue from 'vue'
import Vuetify from "vuetify";
import jest from 'jest-mock'

Vue.use(Vuetify)

let dog,
    wrapper,
    vm

describe('Vuetify', () => {
    beforeEach(() => {
        dog = {age: 2}
        wrapper = mount(Demo, {
            propsData: {
                dog
            },
            vuetify: new Vuetify
        })
    })

    it('v-btn@click', () => {
        wrapper.setMethods({
            btn_click: jest.spyOn(wrapper.vm, 'btn_click'),
            // btn_click:jest.fn(),
        })
        wrapper.find('.v-btn').trigger('click')
        expect(wrapper.vm.btn_click).toBeCalled()
    })
    it('v-select@change', () => {
        wrapper.setMethods({
            select_change: jest.fn(),
        })
        wrapper.find('.v-select').trigger('change', {value: 2})
        expect(wrapper.vm.select_change).toBeCalled()
    })
})

describe('vue-test-utils', () => {
    beforeEach(() => {
        dog = {age: 2}
        wrapper = mount(Demo, {
            propsData: {
                dog
            },
        })
    })
    it('initial state', () => {
        expect(wrapper.vm.$props.dog.age).toBe(2)
        expect(wrapper.text()).toBe('2')
    })
    it('reactive computed', async () => {
        dog.age = 18
        expect(wrapper.vm.dogAge).toBe(18)
        await flushPromises()
    })
    it.skip('reactive view on same props', async () => {
        dog.age = 18
        await flushPromises()
        await new Promise(res => setTimeout(res, 1))
        expect(wrapper.vm.$el.textContent).toBe('18')
    })
    it('reactive view on other props', async () => {
        dog.age = 18
        wrapper.setProps({
            dog: {age: 18}
        })
        await flushPromises()
        expect(wrapper.text()).toBe('18')
    })
})

describe('native', () => {
    beforeEach(() => {
        dog = {age: 2}
        vm = new Vue({
            ...Demo,
            propsData: {
                dog,
            }
        }).$mount()
    })
    it('change reactive property direct', async () => {
        dog.age = 18
        await flushPromises()
        expect(vm.$el.textContent).toBe('18')
    })
})
