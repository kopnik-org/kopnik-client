<template>
    <v-app id="inspire">
        <v-navigation-drawer v-model="drawer" app>
            <v-list dense>
                <v-list-item link>
                    <v-list-item-action>
                        <v-icon>mdi-home</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Home</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link>
                    <v-list-item-action>
                        <v-icon>mdi-contact-mail</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Contact</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar
                app
                color="indigo"
                dark
        >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
            <v-toolbar-title>Application</v-toolbar-title>
        </v-app-bar>

        <v-content>
            <v-container class="fill-height pa-0" fluid>
                <LMap ref="map" style="z-index: 0">
                    <l-tile-layer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
                    >
                    </l-tile-layer>
                    <!--                    <l-control-attribution position="bottomright" prefix="leaflet OpenStreetMap Contributions" >-->

                </LMap>
                <!--                class="align-stretch"-->
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
    import {LMap, LTileLayer, LMarker, LControlAttribution} from 'vue2-leaflet';

    export default {
        components: {
            LMap,
            LTileLayer,
            LMarker,
            LControlAttribution
        },
        props: {
            source: String,
        },
        data: () => ({
            drawer: null,
        }),
        mounted() {
            this.$nextTick(() => {
                // this.map=
                this.$refs.map.mapObject.setView([51.505, -0.09], 13)

            })
        }
    }
</script>