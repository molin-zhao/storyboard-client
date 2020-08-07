<template>
  <div class="index-wrapper">
    <div class="wide-board">
      <div class="wide-board-title">
        <transition name="big">
          <h1 v-show="show">{{ $t("TITLE_PRIMARY") }}</h1>
        </transition>
        <transition name="small">
          <p v-show="show">{{ $t("TITLE_SECONDARY") }}</p>
        </transition>
      </div>
    </div>
    <div class="wide-carousel">
      <div
        id="carousel"
        class="carousel slide"
        data-ride="carousel"
        style="width: 100%; height: 100%"
      >
        <div class="carousel-inner" style="width: 100%; height: 100%">
          <div
            :class="computedBannerActive(index)"
            v-for="(banner, index) in bannerIndexes"
            :key="index"
            style="width: 100%; height: 100%"
          >
            <div class="my-item">
              <div class="item-title">
                <h4>{{ $t(`BANNER${banner}_TITLE`) }}</h4>
                <p>{{ $t(`BANNER${banner}_DESCRIPTION`) }}</p>
              </div>
              <div
                class="item-img"
                :style="computedBannerImgStyle(banner)"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      bannerIndexes: [1, 2, 3]
    };
  },
  computed: {
    computedBannerActive() {
      return function(index) {
        if (index === 0) return "carousel-item active";
        return "carousel-item";
      };
    },
    computedBannerImgStyle() {
      return function(banner) {
        const url = `/static/image/banner${banner}sm.png`;
        return `background-image: url(${url});`;
      };
    }
  },
  mounted() {
    this.show = true;
    $(".carousel").carousel({
      interval: 5000
    });
    // this.$loginAttempt.show({
    //   center: [121.59996, 31.197646],
    //   geo: { province: "上海", city: "上海", district: "浦东新区" }
    // });
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.index-wrapper {
  width: 100%;
  height: 90%;
  margin-top: 5%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  position: relative;
}
.wide-board {
  width: 60%;
  min-width: 700px;
  height: 30%;
  min-height: 300px;
  background-image: url("/static/image/homepagesm.png");
  background-repeat: no-repeat;
  background-position: right;
  border-bottom: 1px gainsboro solid;
}
.wide-carousel {
  width: 50%;
  min-width: 500px;
  height: 30%;
  min-height: 300px;
  border-radius: 10px;
  border: 1px gainsboro solid;
  box-shadow: -5px 2px 5px gainsboro;
  -webkit-box-shadow: -5px 2px 5px gainsboro;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .my-item {
    width: 100%;
    height: 100%;
    min-width: 500px;
    min-height: 250px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .item-title {
      width: 50%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .item-img {
      width: 50%;
      height: 100%;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      background-repeat: no-repeat;
      background-size: cover;
    }
  }
}
.wide-board-title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 50%;
}

// before enter and after leave
.big-enter,
.big-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

// after enter and before leave
.big-leave,
.big-enter-to {
  opacity: 1;
  transform: translateX(0);
}
.big-enter-active,
.big-leave-active {
  transition: all 0.35s;
}

.small-enter,
.small-leave-to {
  opacity: 0;
  transform: translateY(100px);
}

// after enter and before leave
.small-leave,
.small-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.small-enter-active,
.small-leave-active {
  transition: all 0.35s;
}
</style>
