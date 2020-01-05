import 'isomorphic-fetch'
// import {i18n} from '../../vue-setup'
import VueI18n from 'vue-i18n'
import {mount} from '@vue/test-utils'

import KopnikVue from '../../../src/components/KopnikVue'
import Counter from '../../../src/components/Demo'
import {Kopnik} from "../../../src/models";
import flushPromises from "flush-promises";
// import '../../vue-setup'

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
        await flushPromises()
        // console.log(wrapper.vm.$props.value.plain)
        expect(wrapper.text()).toMatch(/Алексей/)
    })
    it('renders', async () => {
        const kopnik2 = await Kopnik.get(2)
        const wrapper = mount(KopnikVue, {
            propsData: {
                value: kopnik2,
                passport: false,
                birthyear: false
            }
        })
        expect(wrapper.vm.$el).toMatchSnapshot()
    })
})

