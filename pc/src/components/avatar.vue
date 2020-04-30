<template>
  <div class="avatar-wrapper">
    <icon
      v-if="!computedImageSource || !show"
      class="empty"
      name="useravatarempty"
      :style="computedIconStyle"
    />
    <div class="avatar-image" v-else>
      <transition>
        <img
          v-show="isLoad"
          @load="loaded"
          @error="defaultImage()"
          :src="computedImageSource"
        />
      </transition>
      <span
        v-show="!isLoad"
        class="spinner-border spinner-border-md"
        role="status"
        :style="`color: ${loadingColor}`"
        aria-hidden="true"
      ></span>
    </div>
  </div>
</template>

<script>
import { DFS_DOMAIN } from "@/common/config/static";
import * as URL from "@/common/utils/url";
export default {
  data() {
    return {
      lookup: false,
      lookupSrc: "",
      show: true,
      isLoad: false
    };
  },
  props: {
    defaultImg: {
      type: String,
      default: "/static/image/user_empty.png"
    },
    loadingColor: {
      type: String,
      default: "gainsboro"
    },
    src: {
      type: String
    },
    iconColor: {
      type: String,
      default: "black"
    },
    iconStyle: {
      type: String,
      default: ""
    },
    userId: {
      type: String,
      default: ""
    }
  },
  computed: {
    computedImageSource() {
      const { src, lookupSrc } = this;
      let _src = lookupSrc || src;
      if (!_src) return "";
      if (_src.startsWith("/static")) return _src;
      return `${DFS_DOMAIN}/${_src}`;
    },
    computedIconStyle() {
      const { iconColor, iconStyle } = this;
      return `color: ${iconColor}; ${iconStyle}`;
    },
    computedImageLoading() {
      const { loading, show, computedImageSource } = this;
      return computedImageSource && show && loading;
    }
  },
  methods: {
    async defaultImage() {
      const { userId, lookup, defaultImg, computedImageSource } = this;
      let img = event.srcElement;
      if (!computedImageSource) {
        img.onerror = null;
        return;
      }
      if (lookup) {
        this.show = false;
        img.onerror = null;
        return;
      }
      try {
        let url = URL.GET_USER_AVATAR(userId);
        const resp = await this.$http.get(url);
        this.lookupSrc = resp.data.data;
      } catch (err) {
        this.show = false;
      } finally {
        this.lookup = true;
        img.onerror = null;
      }
    },
    loaded() {
      this.isLoad = true;
    }
  },
  watch: {
    src(newVal, oldVal) {
      if (newVal) this.isLoad = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.avatar-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .avatar-image {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}

.empty {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
</style>
