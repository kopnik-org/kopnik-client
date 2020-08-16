<template>
  <div style="display: none;">
    <slot v-if="ready"></slot>
  </div>
</template>

<script>
import L from 'leaflet'
import { setOptions } from 'leaflet';
import {AntPath} from 'leaflet-ant-path'
import { findRealParent, propsBinder } from 'vue2-leaflet'

const props = {
  paths: {
    type: Array,
    default: () => []
  },
  options: {
    type: Object,
    custom: true,
    default: () => {}
  },
  visible: {
    type: Boolean,
    custom: true,
    default: true
  }
};
export default {
  name: 'Vue2AntPath',
  props,
  data() {
    return {
      ready: false,
    }
  },
  mounted() {
    this.mapObject = new AntPath(this.paths, this.options);
    L.DomEvent.on(this.mapObject, this.$listeners);
    propsBinder(this, this.mapObject, props);
    this.ready = true;
    this.parentContainer = findRealParent(this.$parent);
    this.parentContainer.addLayer(this, !this.visible);
  },
  beforeDestroy() {
    this.parentContainer.removeLayer(this);
  },
  methods: {
    setVisible(newVal, oldVal) {
      if (newVal == oldVal) return;
      if (newVal) {
        this.parentContainer.addLayer(this);
      } else {
        this.parentContainer.removeLayer(this);
      }
    },
    // TODO: https://github.com/rubenspgcavalcante/leaflet-ant-path#methods
    addLatLng(value) {
      this.mapObject.addLatLng(value);
    },
    setOptions(value){
      setOptions(this.mapObject, value)
      this.mapObject.setStyle(value)
    }
  }
};
</script>
