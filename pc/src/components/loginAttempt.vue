<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="modal-wrapper"
      style="z-index: 10050 !important"
      @click="stopPropagation"
    >
      <transition name="top-in">
        <div class="loggin-map-wrapper display-only">
          <div class="loggin-map-info">
            <span style="font-weight: bold">{{ $t("NEW_LOGIN_ATTEMPT") }}</span>
            <span style="font-size: 12px">{{
              computedLoginAttemptLocation
            }}</span>
          </div>
          <div class="loggin-map-content">
            <div class="content-wrapper" v-if="center && center.length === 2">
              <amap :center="center" />
            </div>
            <div class="content-wrapper" v-else>
              <span v-if="loading" class="spinner-border text-primary"></span>
              <span v-else>{{ $t("LOADING_MAP_ERROR") }}</span>
            </div>
          </div>
          <div class="loggin-map-btns">
            <a
              class="map-btn"
              style="color: var(--main-color-blue)"
              @click="allowLoginAttempt"
              >{{ $t("CONFIRM") }}</a
            >
            <div class="btn-separator" />
            <a
              class="map-btn"
              style="color: var(--main-color-danger)"
              @click="denyLoginAttempt"
              >{{ $t("DENY") }}</a
            >
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import { stopPropagation } from "@/common/utils/mouse";
import amap from "@/components/map";
export default {
  components: {
    amap
  },
  data() {
    return {
      visible: false,
      loaded: false,
      loading: false
    };
  },
  props: {
    geo: {
      type: Object
    },
    center: {
      type: Array
    }
  },
  computed: {
    computedLoginAttemptLocation() {
      const { geo } = this;
      const { province, city, district } = geo;
      return `${this.$t("NEW_LOGIN_FROM")}${province} ${city} ${district}`;
    }
  },
  methods: {
    stopPropagation,
    show() {
      if (!this.visible) this.visible = true;
    },
    hide() {
      if (this.visible) this.visible = false;
    },
    allowLoginAttempt() {},
    denyLoginAttempt() {}
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
  border: 1px whitesmoke solid;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.loggin-map-info {
  width: 90%;
  height: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  span {
    width: 100%;
  }
}
.loggin-map-content {
  width: 90%;
  height: 55%;
  .content-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    span {
      color: var(--main-color-blue);
    }
  }
}

.loggin-map-btns {
  width: 90%;
  height: 15%;
  display: flex;
  flex-direction: row;
  justify-items: center;
  align-items: center;
  .map-btn {
    cursor: pointer;
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .btn-separator {
    width: 1px;
    height: 90%;
    background-color: gainsboro;
  }
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
