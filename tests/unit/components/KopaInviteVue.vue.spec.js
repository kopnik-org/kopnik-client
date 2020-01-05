// import {i18n} from '../../vue-setup'
import VueI18n from 'vue-i18n'
import {mount} from '@vue/test-utils'

import KopaInviteVue from '../../../src/components/KopaInviteVue'
import {Kopnik, Kopa} from "../../../src/models";
import flushPromises from "flush-promises";
import {vuetify} from "../../test-setup";

describe('unit components KopaInviteVue.vue', () => {
    it('render', async () => {
        const kopnik2 = await Kopnik.get(2),
            kopa= new Kopa

        kopa.add(kopnik2)
        const wrapper = mount(KopaInviteVue, {
            vuetify,
            propsData: {value: kopa}
        })
        expect(wrapper.element).toMatchSnapshot()
    })
})
