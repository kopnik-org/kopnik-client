import 'isomorphic-fetch'
import '../../vue-setup'
import {mount} from '@vue/test-utils'
import Vue from 'vue'

import KopnikVue from '../../../src/components/KopnikVue'
import Counter from '../../../src/components/Counter'
import {Kopnik} from "../../../src/models";
import flushPromises from "flush-promises";

describe('Counter', () => {
    describe('sub', () => {
        const count = {count: 0}
        // Теперь монтируем компонент и получаем wrapper
        const wrapper = mount(Counter, {
            propsData: {
                count: count
            }
        })

        it('html', () => {
            expect(wrapper.html()).toContain('<span class="count">0</span>')
        })

        // также легко проверить наличие других элементов
        it('button', () => {
            expect(wrapper.contains('button')).toBe(true)
        })

        it('нажатие кнопки должно увеличивать счётчик', async () => {
            expect(wrapper.vm.count.count).toBe(0)
            expect(wrapper.text()).toContain('0')
            const button = wrapper.find('button')
            button.trigger('click')
            expect(wrapper.vm.count.count).toBe(1)
            count.count = 2
            expect(wrapper.vm.count.count).toBe(2)
            /*        wrapper.setProps({
                        count:{count:1}
                    })*/
            await Vue.nextTick()
            await flushPromises()
            expect(wrapper.text()).toContain('0')
        })
    })
})

describe('unit.components.Kopnik.vue', () => {
    it.skip('renders firstName', async () => {
        const kopnik2 = Kopnik.getReference(2)
        const wrapper = mount(KopnikVue, {
            propsData: {value: kopnik2}
        })
        // await kopnik2.loaded()
        kopnik2.firstName = 'Алексей'
        await Vue.nextTick()
        await Vue.nextTick()
        await Vue.nextTick()
        // console.log(wrapper.vm.$props.value.plain)
        expect(wrapper.text()).toMatch(/Алексей/)
    })
    it('renders', async () => {
        const kopnik2 = await Kopnik.get(2)
        const wrapper = mount(KopnikVue, {
            propsData: {
                value: kopnik2,
                passport: true,
                birthyear: true
            }
        })
        expect(wrapper.html()).toMatchSnapshot()//(/Баранов Алексей/)
    })
})

