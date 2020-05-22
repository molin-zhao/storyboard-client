<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="modal-wrapper"
      style="z-index: 10050 !important"
      @click="stopPropagation"
    >
      <transition name="top-in">
        <div class="loggin-map-wrapper">
          <div>
            <span>{{ computedLoginAttemptLocation }}</span>
          </div>
          <div>
            <el-amap></el-amap>
          </div>
          <div>
            <a></a>
            <div></div>
            <a></a>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import { stopPropagation } from "@/common/utils/mouse";
export default {
  data() {
    return {
      visible: false,
      loaded: false
    };
  },
  props: {
    geo: {
      type: Object
    }
  },
  computed: {
    computedLoginAttemptLocation() {
      const { geo } = this;
    },
    computedMapPlugin() {
      const self = this;
      return {
        plugin: [
          {
            timeout: 100,
            zoomToAccuracy: true,
            extensions: "all",
            pName: "Geolocation",
            events: {
              init: o => {
                o.getCurrentPosition((status, result) => {
                  console.log(result);
                  if (result && result.position) {
                    self.lng = result.position.lng;
                    self.lat = result.position.lat;
                    self.center = [self.lng, self.lat];
                    self.loaded = true;
                    self.$nextTick();
                  }
                });
              }
            }
          }
        ]
      };
    }
  },
  methods: {
    stopPropagation,
    show() {
      this.visible = true;
    },
    hide() {
      this.visible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.loggin-map-wrapper {
  min-width: 300px;
  min-height: 300px;
  width: 20%;
  height: 20%;
  border-radius: 10px;
  background-color: white;
  border: 1px gainsboro solid;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-leave,
.fade-enter-to {
  opacity: 1;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s;
}

.top-in-enter,
.top-in-leave-to {
  transform: translateY(-200px);
}
.top-in-leave,
.top-in-enter-to {
  transform: translateY(0);
}
.top-in-enter-active,
.top-in-leave-active {
  transition: all 0.35s;
}
</style>
