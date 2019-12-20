import 'isomorphic-fetch'
import {mount} from '@vue/test-utils'

import {Kopnik} from "../../../src/models";
import flushPromises from "flush-promises";
import '../../vue-setup'
import ThanksVue from "../../../src/components/ThanksVue";

describe('Thanks', () => {
    it('renders', async () => {
        await Promise.all([1,2,3].map(eachId=>Kopnik.get(eachId)))
        const wrapper = mount(ThanksVue)
        expect(wrapper.vm.$el).toMatchSnapshot()
    })
})
