import {required, email, max, min, size, numeric, length, digits, min_value, max_value,} from "vee-validate/dist/rules";
import { extend } from "vee-validate";

extend("required", {
    ...required,
});

extend("max", {
    ...max,
});
extend("min_value", {
    ...min_value,
});
extend("max_value", {
    ...max_value,
});

extend("email", {
    ...email,
});

extend("length", {
    ...length,
});
extend("numeric", {
    ...numeric,
});

import { localize } from 'vee-validate';
import en from 'vee-validate/dist/locale/en.json';
import ru from 'vee-validate/dist/locale/ru.json';
import sk from 'vee-validate/dist/locale/sk.json';
import pl from 'vee-validate/dist/locale/pl.json';
import de from 'vee-validate/dist/locale/de.json';
import cs from 'vee-validate/dist/locale/cs.json';
import messages from "@/locales";

// Install ru and others messages.
localize({
    en,
    ru,
    sk,
    pl,
    de,
    cs,
})

// названия полей берутся из vue-i18n секция "profile"
let names= {}
for (let [eachLocaleCode, eachLocaleMessages] of Object.entries(messages)){
    names[eachLocaleCode]= {names: eachLocaleMessages.profile}
}
localize(names)

localize('ru')
