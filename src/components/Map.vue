<template>
    <div :id="id" class="map">

    </div>
</template>

<script>
    import l from "leaflet"

    export default {
        name: 'Map',

        data: () => ({
            l,
        }),
        props: {
            id: {
              type:String,
              default: "map"
            }
        },
        mounted() {
          setTimeout(()=>{
            this.l = L.map(this.id).setView([51.505, -0.09], 13)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              // __dummy
            }).addTo(this.l);
          }, 1000)
        }
    }
</script>

<style scoped>
    .map {
        min-height: 100px;
    }
</style>
