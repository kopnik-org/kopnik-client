<template>
    <ValidationObserver ref="obs" v-slot="{ invalid, validated, passes, validate }">
        <v-form>
            <ValidationProvider name="Name" rules="required" v-slot="{ errors, valid }">
                <v-text-field
                        v-model="name"
                        :error-messages="errors"
                        :success="valid"
                        label="Name"
                        required
                ></v-text-field>
            </ValidationProvider>
            <ValidationProvider name="email" rules="required|email"  v-slot="{ errors, valid }">
                <v-text-field
                        v-model="email"
                        :error-messages="errors"
                        :success="valid"
                        label="E-mail"
                        required
                ></v-text-field>
            </ValidationProvider>

            <ValidationProvider name="select" rules="required" v-slot="{ errors, valid }">
                <v-select
                        :items="items"
                        v-model="select"
                        :error-messages="errors"
                        :success="valid"
                        label="Select"
                        required
                ></v-select>
            </ValidationProvider>

            <ValidationProvider rules="required" name="checkbox" v-slot="{ errors, valid }">
                <v-checkbox
                        v-model="checkbox"
                        :error-messages="errors"
                        :success="valid"
                        value="1"
                        label="Option"
                        type="checkbox"
                        required
                ></v-checkbox>
            </ValidationProvider>
        </v-form>
        <v-card-actions>
            <v-btn @click="clear">Clear</v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="validate()">Validate</v-btn>
            <v-btn color="primary" @click="passes(submit)" :disabled="invalid || !validated"
            >Sign Up</v-btn
            >
        </v-card-actions>
    </ValidationObserver>
</template>

<script>
    import {
        ValidationObserver,
        ValidationProvider
    } from "vee-validate";

    export default {
        data: () => ({
            items: ["", "Foo", "Bar"],
            name: "",
            email: "",
            select: "",
            checkbox: ""
        }),
        components: {
            ValidationProvider,
            ValidationObserver
        },
        methods: {
            async clear() {
                this.name = this.email = this.select = this.checkbox = "";
                requestAnimationFrame(() => {
                    this.$refs.obs.reset();
                });
            },
            async submit() {
                console.log('submitting!')
            }
        }
    };
</script>
