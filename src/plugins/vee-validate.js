import { required, email, max , min, size, numeric, length, digits, } from "vee-validate/dist/rules";
import { extend } from "vee-validate";

import i18n from "./i18n"

extend("required", {
    ...required,
    message: "This field is required"
});

extend("max", {
    ...max,
    message: "This field must be {length} characters or less"
});

extend("email", {
    ...email,
    message: "This field must be a valid email"
});

extend("length", {
    ...length,
    message: "This field must be {length} character"
});
extend("numeric", {
    ...numeric,
    message: "This field must be numeric"
});

import { localize } from 'vee-validate';
import en from 'vee-validate/dist/locale/en.json';
import ru from 'vee-validate/dist/locale/ru.json';

// Install English and Arabic locales.
localize({
    en,
    ru
})

let names= {}
for (let [eachLocale, eachLocaleMessages] of Object.entries(i18n.messages)){
    names[eachLocale]= {names: eachLocaleMessages.profile}
}
localize(names)

localize('ru');