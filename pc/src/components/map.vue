<template>
  <div class="map-wrapper">
    <span
      class="spinner-border spinner-border-sm text-secondary map-loading"
      v-if="!loaded"
    ></span>
    <el-amap
      ref="map"
      vid="amap"
      class="amap"
      :amap-manager="amapManager"
      :features="features"
      :center="center"
      :lang="computedMapLocale"
      :zooms="zooms"
      :events="events"
      :drag-enable="false"
      :keyboard-enable="false"
      :touch-zoom="false"
      map-style="amap://styles/fresh"
    >
      <el-amap-marker
        v-for="(marker, index) in markers"
        :key="index"
        :position="marker.position"
        :events="marker.events"
        :visible="marker.visible"
        :draggable="marker.draggable"
        :vid="index"
      ></el-amap-marker>
    </el-amap>
  </div>
</template>

<script>
import { AMapManager, lazyAMapApiLoaderInstance } from "vue-amap";
let amapManager = new AMapManager();
export default {
  props: {
    center: {
      type: Array
    }
  },
  data() {
    return {
      loaded: false,
      amapManager,
      zooms: [12, 14],
      //   center: [121.59996, 31.197646],
      features: ["bg", "road", "building"],
      events: {
        init: o => {},
        moveend: () => {},
        zoomchange: () => {},
        click: e => {},
        complete: () => {
          this.loaded = true;
        }
      },
      markers: [
        {
          position: this.center,
          events: {
            click: () => {},
            dragend: e => {}
          },
          visible: true,
          draggable: false
        }
      ]
    };
  },
  computed: {
    computedMapLocale() {
      const locale = this.$i18n.locale;
      switch (locale) {
        case "zh-CN":
          return "zh_cn";
        case "en-US":
          return "en";
        default:
          return "en";
      }
    }
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.map-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}
.amap {
  width: 100%;
  height: 100%;
}

.map-loading {
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin-top: -10px;
  margin-left: -10px;
}
</style>
