import {mount} from '@vue/test-utils'
import Demo from '../../../src/components/Demo'
import flushPromises from "flush-promises";
import Vue from 'vue'

let dog,
    wrapper,
    vm

beforeEach(() => {
    dog = {age: 2}
    wrapper = mount(Demo, {
        propsData: {
            dog
        }
    })
    vm = new Vue({
        ...Demo,
        propsData: {
            dog,
        }
    }).$mount()
})

describe.skip('vue-test-utils', ()=>{
    it('initial state', () => {
        expect(wrapper.vm.dog.age).toBe(2)
        expect(wrapper.text()).toBe('2')
    })

    it('change reactive property', async () => {
        dog.age = 6
        expect(wrapper.vm.dog.age).toBe(6) // OK
        await flushPromises()
        expect(wrapper.text()).toBe('6') // FAIL!! WHY ??
    })
})


it('change reactive property direct', async () => {
    dog.age = 6
    expect(vm.dog.age).toBe(6) // OK
    // await flushPromises()
    expect(vm.$el.textContent).toBe('6') // OK
})
